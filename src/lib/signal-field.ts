/**
 * Signal Field — the animated network background.
 *
 * Nodes drift, links draw between near neighbours, and "packets" periodically
 * travel a link and pulse the node they land on, cascading one hop further.
 * The pointer acts as a repulsor that also brightens nearby links, so the
 * field visibly reacts to the visitor.
 *
 * Hand-written rather than pulled from a library: this is ~4 KB gzipped where
 * particles.js is ~25 KB, and it needs to read the theme's accent colour and
 * throttle itself, which off-the-shelf options do not do.
 *
 * Budget rules enforced here:
 *   - never mounts under prefers-reduced-motion
 *   - fully stops the rAF loop when the tab is hidden
 *   - drops to low-power mode once the hero scrolls away
 *   - sheds nodes automatically if the rolling frame time degrades
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0..1 — decays each frame, drives the flash when a packet arrives. */
  pulse: number;
  /** Cached per-frame render offset from pointer repulsion. */
  ox: number;
  oy: number;
}

interface Packet {
  from: number;
  to: number;
  /** Progress along the link, 0..1. */
  t: number;
  speed: number;
  /** Hops remaining in this cascade. */
  hops: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const LINK_DIST = 148;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const POINTER_RADIUS = 170;
const POINTER_RADIUS_SQ = POINTER_RADIUS * POINTER_RADIUS;
const PARALLAX = 0.28;

function hexToRgb(input: string): Rgb {
  const value = input.trim();

  const hex = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  // Handles `rgb(74 222 128 / 0.3)`, `rgb(74, 222, 128)` and oklab fallbacks
  // that browsers may hand back from getComputedStyle.
  const nums = value.match(/-?\d*\.?\d+/g);
  if (nums && nums.length >= 3) {
    return { r: +nums[0], g: +nums[1], b: +nums[2] };
  }

  return { r: 74, g: 222, b: 128 };
}

export function initSignalField(canvas: HTMLCanvasElement): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return () => {};

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  // ---- capability tiering -------------------------------------------------
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowPowerDevice = coarse || (navigator.hardwareConcurrency ?? 8) <= 4;

  let width = 0;
  let heightPx = 0;
  let dpr = 1;

  let nodes: Node[] = [];
  let packets: Packet[] = [];
  let maxNodes = 0;

  let accent: Rgb = { r: 74, g: 222, b: 128 };
  let dim: Rgb = { r: 154, g: 160, b: 168 };
  let linkAlpha = 0.5;

  // Pointer state, in CSS pixels. -1 means "no pointer yet".
  let px = -1;
  let py = -1;
  let pointerActive = false;

  let scrollY = 0;
  let heroVisible = true;
  let running = false;
  let rafId = 0;
  let lastTime = 0;
  let packetTimer = 0;

  // Rolling frame-time average for the perf guard.
  let avgFrame = 16.7;
  let guardCooldown = 0;

  function readTheme() {
    const styles = getComputedStyle(document.documentElement);
    accent = hexToRgb(styles.getPropertyValue('--accent') || '#4ade80');
    dim = hexToRgb(styles.getPropertyValue('--text-faint') || '#6b7280');
    // Links need more presence on light backgrounds to stay perceptible.
    const isLight = styles.getPropertyValue('color-scheme').includes('light');
    linkAlpha = isLight ? 0.75 : 0.5;
  }

  function targetNodeCount() {
    const area = width * heightPx;
    const density = lowPowerDevice ? 26000 : 15000;
    const cap = lowPowerDevice ? 34 : 92;
    return Math.max(14, Math.min(cap, Math.round(area / density)));
  }

  function spawn(count: number) {
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * heightPx,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        pulse: 0,
        ox: 0,
        oy: 0,
      });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    heightPx = rect.height || window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(heightPx * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    maxNodes = targetNodeCount();

    if (nodes.length === 0) {
      spawn(maxNodes);
    } else if (nodes.length < maxNodes) {
      spawn(maxNodes - nodes.length);
    } else if (nodes.length > maxNodes) {
      nodes.length = maxNodes;
      packets = packets.filter((p) => p.from < maxNodes && p.to < maxNodes);
    }

    // Pull any node left outside a shrunken viewport back into frame.
    for (const n of nodes) {
      if (n.x > width) n.x = Math.random() * width;
      if (n.y > heightPx) n.y = Math.random() * heightPx;
    }
  }

  /** Pick a neighbour of `from` that is within linking distance. */
  function neighbourOf(from: number): number {
    const a = nodes[from];
    if (!a) return -1;
    const candidates: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (i === from) continue;
      const b = nodes[i];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (dx * dx + dy * dy < LINK_DIST_SQ) candidates.push(i);
    }
    if (!candidates.length) return -1;
    return candidates[(Math.random() * candidates.length) | 0];
  }

  function emitPacket() {
    if (nodes.length < 2) return;
    const from = (Math.random() * nodes.length) | 0;
    const to = neighbourOf(from);
    if (to === -1) return;
    packets.push({ from, to, t: 0, speed: 0.6 + Math.random() * 0.5, hops: 2 });
  }

  function step(dt: number) {
    const drift = dt / 16.7;

    // --- integrate nodes ---
    for (const n of nodes) {
      n.x += n.vx * drift;
      n.y += n.vy * drift;

      // Wrap rather than bounce: bouncing makes the edges feel like walls.
      if (n.x < -20) n.x = width + 20;
      else if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = heightPx + 20;
      else if (n.y > heightPx + 20) n.y = -20;

      if (n.pulse > 0) n.pulse = Math.max(0, n.pulse - dt / 620);

      // Pointer repulsion is a render-time offset, not a velocity change, so
      // the field springs back the moment the cursor leaves.
      let tox = 0;
      let toy = 0;
      if (pointerActive && !lowPowerDevice) {
        const dx = n.x - px;
        const dy = n.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < POINTER_RADIUS_SQ && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / POINTER_RADIUS) ** 2 * 34;
          tox = (dx / d) * force;
          toy = (dy / d) * force;
        }
      }
      n.ox += (tox - n.ox) * Math.min(1, 0.12 * drift);
      n.oy += (toy - n.oy) * Math.min(1, 0.12 * drift);
    }

    // --- advance packets ---
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += (p.speed * dt) / 1000;
      if (p.t >= 1) {
        const landed = nodes[p.to];
        if (landed) landed.pulse = 1;
        packets.splice(i, 1);
        if (p.hops > 0) {
          const next = neighbourOf(p.to);
          if (next !== -1) {
            packets.push({
              from: p.to,
              to: next,
              t: 0,
              speed: p.speed,
              hops: p.hops - 1,
            });
          }
        }
      }
    }

    if (heroVisible && !lowPowerDevice) {
      packetTimer -= dt;
      if (packetTimer <= 0) {
        emitPacket();
        packetTimer = 1400 + Math.random() * 2600;
      }
    }
  }

  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, width, heightPx);

    const yShift = -scrollY * PARALLAX;
    c.save();
    c.translate(0, yShift);

    // --- links ---
    c.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ax = a.x + a.ox;
      const ay = a.y + a.oy;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const bx = b.x + b.ox;
        const by = b.y + b.oy;
        const dx = ax - bx;
        const dy = ay - by;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST_SQ) continue;

        const falloff = 1 - Math.sqrt(d2) / LINK_DIST;

        // Links near the cursor light up in the accent colour.
        let near = 0;
        if (pointerActive && !lowPowerDevice) {
          const mx = (ax + bx) * 0.5 - px;
          const my = (ay + by) * 0.5 - (py + yShift);
          const md2 = mx * mx + my * my;
          if (md2 < POINTER_RADIUS_SQ) near = 1 - Math.sqrt(md2) / POINTER_RADIUS;
        }

        const energy = Math.max(near, a.pulse, b.pulse);
        const col = energy > 0.02 ? accent : dim;
        const alpha = falloff * linkAlpha * (0.2 + energy * 0.8);

        c.strokeStyle = `rgba(${col.r},${col.g},${col.b},${alpha.toFixed(3)})`;
        c.beginPath();
        c.moveTo(ax, ay);
        c.lineTo(bx, by);
        c.stroke();
      }
    }

    // --- nodes: small squares with a ring, reading as network hosts ---
    for (const n of nodes) {
      const x = n.x + n.ox;
      const y = n.y + n.oy;
      const energy = n.pulse;
      const col = energy > 0.02 ? accent : dim;
      const size = 2 + energy * 2.4;

      c.fillStyle = `rgba(${col.r},${col.g},${col.b},${(0.45 + energy * 0.55).toFixed(3)})`;
      c.fillRect(x - size / 2, y - size / 2, size, size);

      if (energy > 0.02) {
        const ring = 5 + (1 - energy) * 14;
        c.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${(energy * 0.5).toFixed(3)})`;
        c.lineWidth = 1;
        c.beginPath();
        c.arc(x, y, ring, 0, Math.PI * 2);
        c.stroke();
      }
    }

    // --- packets ---
    for (const p of packets) {
      const a = nodes[p.from];
      const b = nodes[p.to];
      if (!a || !b) continue;
      const t = p.t;
      const x = (a.x + a.ox) + ((b.x + b.ox) - (a.x + a.ox)) * t;
      const y = (a.y + a.oy) + ((b.y + b.oy) - (a.y + a.oy)) * t;

      c.fillStyle = `rgba(${accent.r},${accent.g},${accent.b},0.95)`;
      c.beginPath();
      c.arc(x, y, 2.1, 0, Math.PI * 2);
      c.fill();

      // Short trail behind the packet.
      c.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},0.35)`;
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(x, y);
      const back = Math.max(0, t - 0.14);
      c.lineTo(
        (a.x + a.ox) + ((b.x + b.ox) - (a.x + a.ox)) * back,
        (a.y + a.oy) + ((b.y + b.oy) - (a.y + a.oy)) * back
      );
      c.stroke();
    }

    c.restore();
  }

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(48, now - lastTime || 16.7);
    lastTime = now;

    // Perf guard: if we are consistently missing frames, shed nodes rather
    // than let a decorative background degrade the whole page.
    avgFrame += (dt - avgFrame) * 0.05;
    if (guardCooldown > 0) guardCooldown -= dt;
    if (avgFrame > 20 && nodes.length > 22 && guardCooldown <= 0) {
      nodes.length = Math.max(22, Math.round(nodes.length * 0.75));
      packets = packets.filter((p) => p.from < nodes.length && p.to < nodes.length);
      guardCooldown = 2500;
      avgFrame = 16.7;
    }

    step(dt);
    draw();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // ---- listeners ----------------------------------------------------------

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 180);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    px = e.clientX;
    py = e.clientY;
    pointerActive = true;
  };

  const onPointerLeave = () => {
    pointerActive = false;
  };

  const onScroll = () => {
    scrollY = window.scrollY;
  };

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const onThemeChange = () => readTheme();

  // Hero visibility gates the expensive extras without stopping the drift,
  // which would look like the page froze.
  let observer: IntersectionObserver | null = null;
  const sentinel = document.getElementById('hero-sentinel');
  if (sentinel && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
      },
      { rootMargin: '0px' }
    );
    observer.observe(sentinel);
  }

  readTheme();
  resize();
  canvas.setAttribute('data-ready', '');

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('themechange', onThemeChange);

  start();

  return () => {
    stop();
    observer?.disconnect();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('themechange', onThemeChange);
  };
}
