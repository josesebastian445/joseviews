/**
 * Computes word count and reading time at build time and exposes them on
 * `remarkPluginFrametmatter`, so post layouts can read them without shipping
 * any client JS or re-parsing the body.
 *
 * Written as a plain tree walk rather than pulling in mdast-util-to-string —
 * it is six lines and one fewer dependency to keep current.
 */

const WORDS_PER_MINUTE = 220;

function collectText(node, out) {
  if (!node) return out;
  if (typeof node.value === 'string' && node.type !== 'code') out.push(node.value);
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectText(child, out);
  }
  return out;
}

export function remarkReadingTime() {
  return function (tree, file) {
    const text = collectText(tree, []).join(' ');
    const words = text.split(/\s+/u).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

    file.data.astro.frontmatter.readingTime = `${minutes} min read`;
    file.data.astro.frontmatter.minutes = minutes;
    file.data.astro.frontmatter.words = words;
  };
}
