import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import { createHeadingId } from '../utils/subjectContentUtils';

function plainText(nodes = []) {
  if (!Array.isArray(nodes)) return '';
  return nodes.map((node) => (
    node?.type === 'text' ? node.value : plainText(node?.children)
  )).join('');
}

function parseInlineFormatting(value) {
  const pattern = /\[\[size=(\d{1,2})\]\]([\s\S]*?)\[\[\/size\]\]|~u~([\s\S]*?)~\/u~/g;
  const nodes = [];
  let cursor = 0;
  let match;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > cursor) nodes.push({ type: 'text', value: value.slice(cursor, match.index) });
    const isSize = match[1] !== undefined;
    nodes.push({
      type: 'emphasis',
      data: isSize
        ? { hName: 'csehub-size', hProperties: { size: Math.min(99, Math.max(12, Number(match[1]))) } }
        : { hName: 'u' },
      children: [{ type: 'text', value: isSize ? match[2] : match[3] }],
    });
    cursor = pattern.lastIndex;
  }
  if (cursor < value.length) nodes.push({ type: 'text', value: value.slice(cursor) });
  return nodes;
}

function remarkSubjectFormatting() {
  return (tree) => {
    const headingCounts = new Map();
    const visit = (parent) => {
      if (!Array.isArray(parent.children) || parent.type === 'code' || parent.type === 'inlineCode') return;
      parent.children = parent.children.flatMap((child) => {
        if (child.type === 'heading') {
          const title = plainText(child.children)
            .replace(/[`*_~]/g, '')
            .trim();
          child.data = {
            ...child.data,
            hProperties: {
              ...child.data?.hProperties,
              id: createHeadingId(title, headingCounts),
            },
          };
        }
        if (child.type === 'text') return parseInlineFormatting(child.value);
        visit(child);
        return [child];
      });
    };
    visit(tree);
  };
}

function SubjectMarkdown({ content }) {
  const isRichHtml = /<\/?(?:p|h[1-6]|ul|ol|li|blockquote|pre|div|span|strong|em|u|s|a|br)\b/i.test(content);
  if (isRichHtml) {
    const cleanHtml = DOMPurify.sanitize(content, { ADD_ATTR: ['data-value'] });
    const documentContent = new DOMParser().parseFromString(cleanHtml, 'text/html');
    const headingCounts = new Map();
    documentContent.body.querySelectorAll('h1, h2, h3').forEach((heading) => {
      heading.id = createHeadingId(heading.textContent, headingCounts);
    });
    const safeHtml = DOMPurify.sanitize(documentContent.body.innerHTML, { ADD_ATTR: ['data-value'] });

    return (
      <div
        className="rich-content break-words space-y-4 text-sm leading-7 text-slate-700"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <div className="break-words space-y-4 text-sm leading-7 text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkSubjectFormatting]}
        components={{
          h1: ({ children, ...props }) => <h1 {...props} className="scroll-mt-24 border-b border-slate-100 pb-3 text-2xl font-bold text-slate-900">{children}</h1>,
          h2: ({ children, ...props }) => <h2 {...props} className="mt-7 scroll-mt-24 text-lg font-bold text-slate-900">{children}</h2>,
          h3: ({ children, ...props }) => <h3 {...props} className="mt-5 scroll-mt-24 text-base font-bold text-slate-800">{children}</h3>,
          p: ({ children }) => <p className="leading-7 text-slate-600">{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-5 marker:text-emerald-600">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-emerald-700">{children}</ol>,
          li: ({ children }) => <li className="pl-1 leading-6 text-slate-600">{children}</li>,
          u: ({ children }) => <u className="underline decoration-emerald-500 underline-offset-4">{children}</u>,
          'csehub-size': ({ node, children }) => <span style={{ fontSize: `${node.properties.size}px` }}>{children}</span>,
          blockquote: ({ children }) => <blockquote className="rounded-r-lg border border-amber-200 border-l-4 border-l-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">{children}</blockquote>,
          code: ({ children }) => <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-xs text-emerald-800">{children}</code>,
          pre: ({ children }) => <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6">{children}</pre>,
          a: ({ children, href }) => <a href={href} className="text-emerald-700 underline hover:text-emerald-900" target="_blank" rel="noreferrer">{children}</a>,
          hr: () => <hr className="border-slate-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default SubjectMarkdown;
