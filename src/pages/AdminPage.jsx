import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import SubjectMarkdown from '../components/SubjectMarkdown';

const DOMAINS = ['DSA', 'Web Development', 'Machine Learning', 'Systems', 'Programming'];
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];
const getLocalDate = () => {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localToday.toISOString().slice(0, 10);
};
const createEmptyForm = (author = '') => ({
  name: '',
  author,
  publish_date: getLocalDate(),
  description: '',
  icon: 'school',
  domain: 'DSA',
  content_markdown: '',
  code_snippets: LANGUAGES.map((language) => ({ language, code: '' })),
  is_active: true,
});
const fieldClass = 'w-full rounded-md border border-slate-700/70 bg-[#10182a] px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-400';
const labelClass = 'mb-2 block font-mono text-[11px] font-semibold tracking-wide text-slate-400';
const panelClass = 'overflow-hidden rounded-xl border border-slate-700/60 bg-[#141e31] shadow-[0_18px_48px_rgba(0,0,0,0.12)]';
const iconClass = 'material-symbols-outlined';

function AdminPage() {
  const { saveSubject } = useSubjects();
  const [form, setForm] = useState(() => createEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES[0]);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateSnippet = (language, code) => {
    setForm((current) => ({
      ...current,
      code_snippets: current.code_snippets.map((snippet) => (
        snippet.language === language ? { ...snippet, code } : snippet
      )),
    }));
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setPreview(false);
    setActionError('');
  };

  const persistSubject = async () => {
    setSaving(true);
    setNotice('');
    setActionError('');
    try {
      await saveSubject({ ...form, is_active: true }, editingId);
      setNotice(editingId ? 'Subject updated.' : 'Subject published.');
      resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setActionError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await persistSubject();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090f1e] text-slate-200">
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6">
      <div className="mb-7 flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="Back to catalog" className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white">
            <span className={iconClass}>arrow_back</span>
          </Link>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-slate-500">ADMIN / SUBJECT REPOSITORY</p>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-100">Publish Subject</h1>
          </div>
          <span className="hidden rounded border border-emerald-400/20 bg-emerald-400/5 px-2 py-1 font-mono text-[10px] text-emerald-300 sm:inline">Ready to Publish</span>
        </div>
        <Link to="/" aria-label="View subject catalog" className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-emerald-400/40 hover:text-white">
          <span className={`${iconClass} text-sm`}>visibility</span>
          Live Preview
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section aria-label="Subject domain taxonomy">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Subject domain taxonomy</p>
            <span className="text-[10px] text-slate-500">Selected: <strong className="text-emerald-300">{form.domain}</strong></span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DOMAINS.map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => updateField('domain', domain)}
                aria-pressed={form.domain === domain}
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold transition ${form.domain === domain ? 'border-violet-400/50 bg-violet-500/15 text-white' : 'border-slate-700 bg-[#111a2c] text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
              >
                {domain}
              </button>
            ))}
          </div>
        </section>

        {actionError && (
          <p role="alert" className="rounded-lg border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {actionError}
          </p>
        )}
        {notice && <p role="status" className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}

        <section className={panelClass}>
          <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-4 sm:px-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-100">
              <span className={`${iconClass} text-violet-300`}>article</span>
              Metadata &amp; Attribution
            </h2>
            <span className="rounded border border-slate-700 bg-slate-800/70 px-2 py-1 font-mono text-xs text-sky-300">
              ID: SUB-{editingId || 'NEW'}
            </span>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <label>
              <span className={labelClass}>Title Name <span className="text-rose-400">*</span></span>
              <input required maxLength={100} className={fieldClass} placeholder="Asynchronous JavaScript & Event Loops" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Author by</span>
              <input required maxLength={100} className={fieldClass} placeholder="Author name" value={form.author} onChange={(event) => updateField('author', event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Publish date</span>
              <input required type="date" className={fieldClass} value={form.publish_date} onChange={(event) => updateField('publish_date', event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Subtitle Name</span>
              <textarea rows={2} className={fieldClass} placeholder="A concise introduction to this subject..." value={form.description} onChange={(event) => updateField('description', event.target.value)} />
            </label>
            <label>
              <span className={labelClass}>Catalog Icon <span className="text-slate-500">(Material Symbol Name)</span></span>
              <input maxLength={50} className={fieldClass} placeholder="school" value={form.icon} onChange={(event) => updateField('icon', event.target.value)} />
            </label>
          </div>
        </section>

        <section className={panelClass}>
          <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-4 sm:px-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-100">
              <span className={`${iconClass} text-cyan-300`}>auto_awesome</span>
              Subtitle Content
            </h2>
            <span className="rounded border border-emerald-400/20 bg-emerald-400/5 px-2 py-1 font-mono text-[10px] font-semibold text-emerald-300">MARKDOWN ENABLED</span>
          </div>
          {preview ? (
            <div className="min-h-[40rem] bg-[#f1f1f1] p-5 text-black">
              <SubjectMarkdown content={form.content_markdown || '*Markdown preview will appear here.*'} />
            </div>
          ) : (
            <textarea
              rows={30}
              className="min-h-[40rem] w-full resize-y bg-[#f1f1f1] p-5 font-mono text-sm leading-7 text-black placeholder:text-slate-500 focus:outline-none"
              placeholder="Paste your structured prompt output or markdown documentation here..."
              value={form.content_markdown}
              onChange={(event) => updateField('content_markdown', event.target.value)}
            />
          )}
          <div className="flex items-center justify-between border-t border-slate-700/60 px-4 py-3 font-mono text-[11px] text-slate-400">
            <span className={form.is_active ? 'text-emerald-300' : 'text-amber-300'}>● {form.is_active ? 'Active' : 'Draft'}</span>
            <span>{form.content_markdown.trim() ? form.content_markdown.trim().split(/\s+/).length : 0} words · ~{Math.ceil(form.content_markdown.trim().split(/\s+/).filter(Boolean).length / 200)} min read</span>
            <button type="button" onClick={() => setPreview((current) => !current)} className="font-semibold text-sky-300 hover:text-sky-200">
              {preview ? 'Edit Markdown' : 'Preview Markdown'}
            </button>
          </div>
        </section>

        <section className={panelClass}>
          <div className="flex items-center justify-between px-4 py-4 sm:px-5">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-100">
                <span className={`${iconClass} text-violet-300`}>code_blocks</span>
                Code Snippet
              </h2>
              <p className="mt-1 text-xs text-slate-500">Add examples readers can copy, inspect, and execute.</p>
            </div>
            <span className="rounded border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 font-mono text-xs text-emerald-300">Interactive</span>
          </div>
          <div className="flex overflow-x-auto border-y border-slate-700/60 bg-slate-900/35">
            {LANGUAGES.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setActiveLanguage(language)}
                className={`shrink-0 border-b-2 px-4 py-3 font-mono text-xs font-semibold transition ${activeLanguage === language ? 'border-violet-300 text-slate-100' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <span className="mr-2 text-violet-300">●</span>{language}
              </button>
            ))}
          </div>
          <textarea
            rows={10}
            spellCheck="false"
            aria-label={`${activeLanguage} code snippet`}
            className="w-full resize-y bg-[#080e1b] p-5 font-mono text-sm leading-7 text-emerald-200 placeholder:text-slate-500 focus:outline-none"
            placeholder={`// Write a ${activeLanguage} example...`}
            value={form.code_snippets.find((snippet) => snippet.language === activeLanguage)?.code || ''}
            onChange={(event) => updateSnippet(activeLanguage, event.target.value)}
          />
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-[#111a2c] p-4">
          <div className="flex w-full gap-3 sm:w-auto">
            <button type="submit" disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(16,185,129,0.14)] transition hover:brightness-110 disabled:opacity-50 sm:flex-none">
              <span className={`${iconClass} text-base`}>publish</span>
              {saving ? 'Publishing...' : 'Publish to Catalog'}
            </button>
          </div>
        </section>
      </form>
    </div>
    </div>
  );
}

export default AdminPage;
