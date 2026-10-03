export function cleanPastedArticleText(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/\\r\\n|\\n/g, '\n')
    .replace(/\\t/g, '  ')
    .replace(/\\(["'`/])/g, '$1')
    .replace(/\\\\/g, '\\')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseArticleContent(content) {
  const blocks = [];
  const lines = (content || '').split(/\r?\n/);
  let paragraph = [];
  let listItems = [];
  let currentListType = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) blocks.push({ type: currentListType, items: listItems });
    listItems = [];
    currentListType = null;
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      const language = trimmed.slice(3).trim() || 'Plain Text';
      const codeLines = [];
      lineIndex += 1;
      while (lineIndex < lines.length && !lines[lineIndex].trim().startsWith('```')) {
        codeLines.push(lines[lineIndex]);
        lineIndex += 1;
      }
      blocks.push({ type: 'code', language, code: codeLines.join('\n') });
      continue;
    }
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: trimmed.replace(/^#{1,3}\s+/, '') });
      continue;
    }
    const bullet = trimmed.match(/^[-*+]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const type = numbered ? 'ordered' : 'unordered';
      if (currentListType && currentListType !== type) flushList();
      currentListType = type;
      listItems.push((bullet || numbered)[1]);
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return blocks;
}