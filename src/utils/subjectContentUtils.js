export function createHeadingId(title, counts) {
  const base = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
  const count = counts.get(base) || 0;
  counts.set(base, count + 1);
  return count ? `${base}-${count}` : base;
}

export function getMarkdownHeadings(content) {
  const counts = new Map();
  if (/<h[1-6]\b/i.test(content)) {
    const parsed = new DOMParser().parseFromString(content, 'text/html');
    return [...parsed.body.querySelectorAll('h1, h2, h3')].map((heading) => ({
      level: Number(heading.tagName.slice(1)),
      title: heading.textContent.trim(),
      id: createHeadingId(heading.textContent, counts),
    }));
  }

  return content.split('\n').flatMap((line) => {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) return [];
    const title = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .trim();
    return [{ level: match[1].length, title, id: createHeadingId(title, counts) }];
  });
}
