/**
 * Shared micro-interactions, initialised once per page.
 *
 * Everything here is progressive enhancement: the markup is complete and
 * readable before any of this runs, and all of it no-ops under
 * prefers-reduced-motion. Total cost is roughly 2 KB gzipped.
 */

const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = () => window.matchMedia('(pointer: fine)').matches;

/** Fires `cb` the first time `el` scrolls into view, then stops watching. */
function onceVisible(el: Element, cb: () => void, threshold = 0.3) {
  if (!('IntersectionObserver' in window)) {
    cb();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        cb();
      }
    },
    { threshold }
  );
  io.observe(el);
}

/* ------------------------------------------------------------------ *
 * Terminal — types a sequence of lines with a blinking block cursor.
 * ------------------------------------------------------------------ */

export function initTerminal() {
  document.querySelectorAll<HTMLElement>('[data-terminal]').forEach((root) => {
    const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-line]'));
    if (!lines.length) return;

    if (REDUCED()) {
      lines.forEach((l) => {
        l.style.visibility = 'visible';
        l.classList.remove('caret');
      });
      return;
    }

    // Reserve the final height up front so typing can never shift layout.
    root.style.minHeight = `${root.offsetHeight}px`;

    const texts = lines.map((l) => l.dataset.line ?? l.textContent ?? '');
    lines.forEach((l) => {
      l.textContent = '';
      l.style.visibility = 'hidden';
      l.classList.remove('caret');
    });

    let li = 0;
    let ci = 0;

    const tick = () => {
      const line = lines[li];
      if (!line) return;

      if (ci === 0) {
        line.style.visibility = 'visible';
        line.classList.add('caret');
      }

      const text = texts[li];
      if (ci < text.length) {
        line.textContent = text.slice(0, ++ci);
        // Slight jitter reads as typing rather than a machine ticker.
        setTimeout(tick, 22 + Math.random() * 34);
        return;
      }

      line.classList.remove('caret');
      li += 1;
      ci = 0;
      if (li < lines.length) setTimeout(tick, 260);
      else lines[lines.length - 1].classList.add('caret');
    };

    onceVisible(root, () => setTimeout(tick, 400), 0.15);
  });
}

/* ------------------------------------------------------------------ *
 * Typewriter — rotates through a list of words, deleting between each.
 * ------------------------------------------------------------------ */

export function initTypewriter() {
  document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach((el) => {
    let words: string[] = [];
    try {
      words = JSON.parse(el.dataset.typewriter || '[]');
    } catch {
      return;
    }
    if (!words.length) return;

    const out = el.querySelector<HTMLElement>('[data-typewriter-out]') ?? el;

    if (REDUCED()) {
      out.textContent = words[0];
      return;
    }

    // Lock the width to the longest entry so the line never reflows.
    let wi = 0;
    let ci = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      out.textContent = word.slice(0, ci);

      let delay = deleting ? 40 : 75;

      if (!deleting && ci === word.length) {
        delay = 1600;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        delay = 320;
      }

      setTimeout(tick, delay);
    };

    onceVisible(el, () => setTimeout(tick, 900), 0.1);
  });
}

/* ------------------------------------------------------------------ *
 * Count up — animates a number once it scrolls into view.
 * ------------------------------------------------------------------ */

export function initCountUp() {
  document.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => {
    const target = Number(el.dataset.countup ?? '0');
    if (!Number.isFinite(target)) return;

    if (REDUCED()) {
      el.textContent = String(target);
      return;
    }

    onceVisible(el, () => {
      const duration = 1400;
      const start = performance.now();

      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // easeOutExpo — fast start, long settle, reads as "landing" on a value
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }, 0.5);
  });
}

/* ------------------------------------------------------------------ *
 * Magnetic buttons — translate toward the cursor on approach.
 * ------------------------------------------------------------------ */

export function initMagnetic() {
  if (REDUCED() || !FINE_POINTER()) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || '0.28');
    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // Only pull once the pointer is within roughly one button of the edge.
      const range = Math.max(r.width, r.height) * 0.9;
      const dist = Math.hypot(dx, dy);
      if (dist > range) {
        tx = 0;
        ty = 0;
      } else {
        tx = dx * strength;
        ty = dy * strength;
      }
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const reset = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
  });
}

/* ------------------------------------------------------------------ *
 * Tilt — 3D rotation following the pointer inside an element.
 * ------------------------------------------------------------------ */

export function initTilt() {
  if (REDUCED() || !FINE_POINTER()) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt || '8');
    let raf = 0;
    let rx = 0;
    let ry = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    };

    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        ry = nx * max * 2;
        rx = -ny * max * 2;
        if (!raf) raf = requestAnimationFrame(apply);
      },
      { passive: true }
    );

    el.addEventListener('pointerleave', () => {
      rx = 0;
      ry = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
  });
}

/* ------------------------------------------------------------------ *
 * Live clock — Dubai time in the hero status card.
 * ------------------------------------------------------------------ */

export function initClock() {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!els.length) return;

  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const tick = () => {
    const now = fmt.format(new Date());
    els.forEach((el) => (el.textContent = now));
  };

  tick();
  setInterval(tick, 30_000);
}

export function initAll() {
  initTerminal();
  initTypewriter();
  initCountUp();
  initMagnetic();
  initTilt();
  initClock();
}
