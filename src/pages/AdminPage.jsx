import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../context/ArticlesContext';
import { cleanPastedArticleText } from '../utils/articleText';

const emptyArticle = {
  category: '',
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  authorName: '',
  title: '',
  subtitle: '',
  content: '',
  codeBlocks: [{ language: 'Python', code: '' }],
};

const fieldClass = 'w-full rounded-md border border-white/10 bg-[#10141e] px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400';
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400';

function AdminPage() {
  const { articles, saveArticle, deleteArticle } = useArticles();
  const [form, setForm] = useState(emptyArticle);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateCodeBlock = (index, field, value) => {
    setForm((current) => ({
      ...current,
      codeBlocks: current.codeBlocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = cleanPastedArticleText(event.clipboardData.getData('text/plain'));
    updateField('content', `${form.content}${form.content ? '\n' : ''}${pasted}`);
  };

  const resetForm = () => {
    setForm({ ...emptyArticle, codeBlocks: [{ language: 'Python', code: '' }] });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const article = {
      ...form,
      id: editingId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      codeBlocks: form.codeBlocks.filter((block) => block.code.trim()),
    };
    saveArticle(article);
    setNotice(editingId ? 'Article changes saved locally.' : 'Article added to this browser.');
    resetForm();
    window.setTimeout(() => setNotice(''), 3000);
  };

  const startEditing = (article) => {
    setForm({ ...article, codeBlocks: article.codeBlocks?.length ? article.codeBlocks : [{ language: 'Python', code: '' }] });
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">CSEHub / Workspace</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Article studio</h1>
          <p className="mt-2 text-sm text-slate-400">Create and manage learning articles. Changes stay in this browser.</p>
        </div>
        <div className="rounded-md border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-xs font-semibold text-violet-200">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </div>
      </div>

      {notice && <p role="status" className="mb-5 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="border-b border-white/10 pb-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit article' : 'New article'}</h2>
              {editingId && <button type="button" onClick={resetForm} className="text-sm text-slate-400 hover:text-white">Cancel edit</button>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className={labelClass}>Category / subject</span><input required className={fieldClass} placeholder="DSA" value={form.category} onChange={(event) => updateField('category', event.target.value)} /></label>
              <label><span className={labelClass}>Publication date</span><input required className={fieldClass} placeholder="Oct 3, 2026" value={form.date} onChange={(event) => updateField('date', event.target.value)} /></label>
              <label><span className={labelClass}>Author name</span><input required className={fieldClass} placeholder="John Doe" value={form.authorName} onChange={(event) => updateField('authorName', event.target.value)} /></label>
              <label><span className={labelClass}>Article title</span><input required className={fieldClass} placeholder="Selection Sort Algorithm" value={form.title} onChange={(event) => updateField('title', event.target.value)} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Subtitle / short description</span><input required className={fieldClass} placeholder="A short summary for learners" value={form.subtitle} onChange={(event) => updateField('subtitle', event.target.value)} /></label>
            </div>
          </section>

          <section className="border-b border-white/10 pb-6">
            <label htmlFor="article-content" className={labelClass}>Article content</label>
            <textarea id="article-content" required rows="13" className={`${fieldClass} resize-y font-mono leading-6`} placeholder={'1. Introduction\n\nWrite paragraphs, headings, and - bullet points here...'} value={form.content} onChange={(event) => updateField('content', event.target.value)} onPaste={handlePaste} />
            <p className="mt-2 text-xs text-slate-500">Pasted escaped newlines and formatting artifacts are cleaned automatically. Markdown headings and lists are supported.</p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Code blocks</h2>
              <button type="button" onClick={() => setForm((current) => ({ ...current, codeBlocks: [...current.codeBlocks, { language: 'Python', code: '' }] }))} className="text-sm font-semibold text-violet-300 hover:text-violet-200">+ Add code block</button>
            </div>
            {form.codeBlocks.map((block, index) => (
              <div key={index} className="overflow-hidden rounded-md border border-white/10 bg-[#0c1018]">
                <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                  <select aria-label={`Code language ${index + 1}`} className="bg-transparent text-sm text-slate-200 outline-none" value={block.language} onChange={(event) => updateCodeBlock(index, 'language', event.target.value)}>
                    {['Python', 'JavaScript', 'Java', 'C++', 'C', 'TypeScript', 'SQL', 'Bash', 'Plain Text'].map((language) => <option className="bg-[#10141e]" key={language}>{language}</option>)}
                  </select>
                  {form.codeBlocks.length > 1 && <button type="button" onClick={() => setForm((current) => ({ ...current, codeBlocks: current.codeBlocks.filter((_, blockIndex) => blockIndex !== index) }))} className="text-xs text-slate-500 hover:text-rose-300">Remove</button>}
                </div>
                <textarea aria-label={`Code block ${index + 1}`} rows="7" className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-200 outline-none" placeholder="Paste or write code..." value={block.code} onChange={(event) => updateCodeBlock(index, 'code', event.target.value)} />
              </div>
            ))}
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded-md bg-violet-400 px-5 py-3 text-sm font-bold text-[#171124] transition hover:bg-violet-300">{editingId ? 'Save changes' : 'Publish locally'}</button>
            <button type="button" onClick={resetForm} className="rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5">Clear form</button>
          </div>
        </form>

        <aside className="xl:sticky xl:top-24">
          <h2 className="mb-4 text-lg font-bold text-white">Articles</h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {articles.map((article) => (
              <article key={article.id} className="py-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><span className="text-violet-300">{article.category}</span><span>·</span><span>{article.date}</span></div>
                <h3 className="font-bold text-slate-100">{article.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-400">{article.subtitle}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <Link to={`/article/${encodeURIComponent(article.id)}`} className="text-violet-300 hover:text-violet-200">Preview article</Link>
                  <button type="button" onClick={() => startEditing(article)} className="text-slate-300 hover:text-white">Edit</button>
                  <button type="button" onClick={() => { if (window.confirm(`Delete “${article.title}”?`)) deleteArticle(article.id); }} className="text-rose-300 hover:text-rose-200">Delete</button>
                </div>
              </article>
            ))}
            {!articles.length && <p className="py-8 text-sm text-slate-500">No articles yet. Add one using the form.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminPage;