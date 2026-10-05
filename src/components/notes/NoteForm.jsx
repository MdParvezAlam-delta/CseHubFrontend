import { useRef, useState } from 'react';

const EMPTY_NOTE = {};

function NoteForm({ onSubmit, initialValues = EMPTY_NOTE, buttonText = 'Save Note' }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [date, setDate] = useState(initialValues.date || new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState(initialValues.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  const wrapSelection = (prefix, suffix = prefix) => {
    const editor = contentRef.current;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = content.slice(start, end) || 'text';
    setContent(`${content.slice(0, start)}${prefix}${selected}${suffix}${content.slice(end)}`);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title, date, content });
      if (!initialValues.title) {
        setTitle('');
        setDate(new Date().toISOString().slice(0, 10));
        setContent('');
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
      <input required
        className="w-full rounded-xl border border-slate-700 bg-[#0b1426] px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-cyan-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
      />
      <input
        className="w-full rounded-xl border border-slate-700 bg-[#0b1426] px-3 py-3 font-mono text-xs text-slate-100 outline-none focus:border-cyan-400"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
        <span>Content</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => wrapSelection('**')} className="px-1.5 py-1 hover:text-cyan-300" aria-label="Bold note text">B</button>
          <button type="button" onClick={() => wrapSelection('*')} className="px-1.5 py-1 italic hover:text-cyan-300" aria-label="Italic note text">I</button>
          <button type="button" onClick={() => wrapSelection('`')} className="px-1.5 py-1 hover:text-cyan-300" aria-label="Code note text">&lt;&gt;</button>
          <button type="button" onClick={() => wrapSelection('- ', '')} className="px-1.5 py-1 hover:text-cyan-300" aria-label="Bullet note text">☷</button>
        </div>
      </div>
      <textarea
        ref={contentRef}
        className="min-h-36 w-full rounded-xl border border-slate-700 bg-[#0b1426] px-3 py-3 text-sm leading-6 text-slate-100 placeholder:text-slate-400 outline-none focus:border-cyan-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />
      <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-900/20 disabled:opacity-50" type="submit" disabled={saving}>
        {saving ? 'Saving...' : buttonText} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

export default NoteForm;