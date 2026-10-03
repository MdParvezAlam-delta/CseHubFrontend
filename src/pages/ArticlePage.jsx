import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/github-dark.css';
import { useArticles } from '../context/ArticlesContext';
import { parseArticleContent } from '../utils/articleText';

[
  ['bash', bash],
  ['c', c],
  ['cpp', cpp],
  ['java', java],
  ['javascript', javascript],
  ['python', python],
  ['sql', sql],
  ['typescript', typescript],
].forEach(([name, language]) => hljs.registerLanguage(name, language));

function CodeBlock({ block, index }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const languageAliases = { 'C++': 'cpp', C: 'c', JavaScript: 'javascript', TypeScript: 'typescript', 'Plain Text': 'plaintext' };
  const languageClass = languageAliases[block.language] || block.language.toLowerCase();

  useEffect(() => {
    if (codeRef.current && hljs.getLanguage(languageClass)) hljs.highlightElement(codeRef.current);
  }, [block.code, languageClass]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div key={`${block.language}-${index}`} className="my-7 overflow-hidden rounded-lg border border-white/10 bg-[#11131a] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="text-xs font-semibold text-slate-400">{block.language}</span>
        <button type="button" onClick={copyCode} className="rounded px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">{copied ? 'Copied' : 'Copy code'}</button>
      </div>
      <pre className="overflow-x-auto p-5 text-[13px] leading-6"><code ref={codeRef} className={`language-${languageClass}`}>{block.code}</code></pre>
    </div>
  );
}

function ArticleBody({ article }) {
  const blocks = parseArticleContent(article.content);
  return (
    <div className="article-prose">
      {blocks.map((block, index) => {
        if (block.type === 'heading') return <h2 key={index} className="mb-3 mt-9 text-xl font-bold tracking-tight text-white">{block.text}</h2>;
        if (block.type === 'code') return <CodeBlock block={block} index={index} key={`markdown-${index}`} />;
        if (block.type === 'ordered') return <ol key={index} className="my-5 list-decimal space-y-2 pl-6 text-[15px] leading-7 text-slate-300">{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ol>;
        if (block.type === 'unordered') return <ul key={index} className="my-5 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-300">{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>;
        return <p key={index} className="my-4 text-[15px] leading-7 text-slate-300">{block.text}</p>;
      })}
      {(article.codeBlocks || []).filter((block) => block.code.trim()).map((block, index) => <CodeBlock block={block} index={index} key={`${block.language}-${index}`} />)}
    </div>
  );
}

function ArticlePage() {
  const { id } = useParams();
  const { articles } = useArticles();
  const [hasMockAccess, setHasMockAccess] = useState(() => localStorage.getItem('csehub_mock_article_access') === 'enabled');
  const article = articles.find((item) => item.id === decodeURIComponent(id || ''));

  if (!article) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center"><h1 className="text-2xl font-bold text-white">Article not found</h1><Link to="/admin" className="mt-4 inline-block text-violet-300 hover:text-violet-200">Back to article studio</Link></div>;
  }

  if (!hasMockAccess) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-violet-300/30 bg-violet-300/10 font-mono text-lg text-violet-200">&lt;/&gt;</div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Learner preview</p>
        <h1 className="mt-3 text-2xl font-bold text-white">{article.title}</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">This reader uses a temporary mock access state. Enable preview access to view the article.</p>
        <button type="button" onClick={() => { localStorage.setItem('csehub_mock_article_access', 'enabled'); setHasMockAccess(true); }} className="mt-6 rounded-md bg-violet-400 px-5 py-3 text-sm font-bold text-[#171124] hover:bg-violet-300">Continue as demo learner</button>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"><span aria-hidden="true">←</span> CSEHub</Link>
      <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500"><span>{article.category}</span><span>·</span><span>{article.date}</span><span>·</span><span>By {article.authorName}</span></div>
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">{article.title}</h1>
      <p className="mt-4 text-lg leading-7 text-slate-400">{article.subtitle}</p>
      <hr className="my-8 border-white/10" />
      <ArticleBody article={article} />
    </article>
  );
}

export default ArticlePage;