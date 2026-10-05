import { useMemo, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteForm from '../components/notes/NoteForm';
import NoteList from '../components/notes/NoteList';
import NoteEditor from '../components/notes/NoteEditor';

const samples = [
  { title: 'JavaScript event loop', date: new Date().toISOString().slice(0, 10), content: 'Call stack runs synchronous code.\n\nThe event loop schedules queued callbacks after the stack is clear.' },
  { title: 'Study checklist', date: new Date().toISOString().slice(0, 10), content: '- Review data structures\n- Practice graph traversal\n- Revise complexity analysis' },
];

function NotesPage() {
  const { notes, loading, error, addNote, editNote, removeNote } = useNotes();
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes.filter((note) => !query || `${note.title} ${note.content}`.toLowerCase().includes(query));
  }, [notes, search]);

  const handleCreate = async (data) => {
    setActionError('');
    try {
      await addNote(data);
      setNotice('Note created.');
    } catch (saveError) {
      setActionError(saveError.message);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await editNote(id, data);
      setEditingNote(null);
      setNotice('Note updated.');
    } catch (saveError) {
      setActionError(saveError.message);
    }
  };

  const loadSamples = async () => {
    setActionError('');
    try {
      for (const sample of samples) await addNote(sample);
      setNotice('Sample notes added.');
    } catch (saveError) {
      setActionError(saveError.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      await removeNote(id);
    } catch (deleteError) {
      setActionError(deleteError.message);
    }
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-7 text-slate-100 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30">
            <span className="material-symbols-outlined">edit_note</span>
          </span>
          <div>
            <h1 className="text-xl font-extrabold">Notebook <span className="ml-1 rounded-full bg-cyan-500/15 px-2 py-1 align-middle font-mono text-[9px] text-cyan-300">v2.4</span></h1>
            <p className="text-xs text-slate-400">Personal notes, ideas, and code memos</p>
          </div>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notes, tags..."
          aria-label="Search notes"
          className="w-full rounded-lg border border-slate-700 bg-[#0d1628] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-400 sm:w-64"
        />
      </div>

      {(error || actionError) && <p role="alert" className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{actionError || error}</p>}
      {notice && <p role="status" className="mb-4 text-xs text-emerald-300">{notice}</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(330px,0.8fr)_minmax(0,1.2fr)]">
        <aside className="rounded-2xl border border-slate-700/80 bg-[#131d30] p-5 shadow-xl shadow-black/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold"><span className="material-symbols-outlined text-cyan-400">edit_note</span>Create Note</h2>
            <span className="rounded bg-slate-800 px-2 py-1 font-mono text-[8px] tracking-widest text-slate-400">MARKDOWN READY</span>
          </div>
          <NoteForm onSubmit={handleCreate} buttonText="Create Note" />
          {editingNote && (
            <div className="mt-7 border-t border-slate-700 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold">Edit Note</h2>
                <button type="button" onClick={() => setEditingNote(null)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
              </div>
              <NoteEditor key={editingNote._id} note={editingNote} onSave={handleUpdate} />
            </div>
          )}
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="inline-flex rounded-xl border border-slate-700 bg-[#111a2c] p-1">
              <button type="button" onClick={() => setShowAll(false)} className={`rounded-lg px-3 py-2 text-[10px] ${!showAll ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400'}`}>Current View <span className="ml-1 text-emerald-400">●</span></button>
              <button type="button" onClick={() => setShowAll(true)} className={`rounded-lg px-3 py-2 text-[10px] ${showAll ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400'}`}>All Notes Preview <span className="ml-1 rounded bg-slate-700 px-1.5">{filteredNotes.length}</span></button>
            </div>
            <span className="font-mono text-[10px] text-slate-400">↕ Sort: Recent</span>
          </div>

          {loading ? (
            <div className="flex min-h-[270px] items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1424] text-sm text-slate-400">Loading notes...</div>
          ) : filteredNotes.length ? (
            <NoteList notes={filteredNotes} onEdit={setEditingNote} onDelete={deleteNote} onOpen={setSelectedNote} />
          ) : (
            <div className="flex min-h-[270px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1424] px-6 py-10 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-[#17243a] text-cyan-400">
                <span className="material-symbols-outlined text-2xl">folder_open</span>
              </span>
              <h2 className="font-bold text-white">No notes found.</h2>
              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">Your thoughts, code memos, and ideas will appear here once created. Use the form to write your first entry.</p>
              {!search && <button type="button" onClick={loadSamples} className="mt-4 rounded-lg border border-slate-700 bg-[#17243a] px-3 py-2 text-[10px] font-semibold text-cyan-300 hover:border-cyan-500/40"><span className="mr-1">◎</span> Preview with Sample Notes</button>}
            </div>
          )}
        </div>
      </div>

      {selectedNote && (
        <div role="presentation" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4" onClick={() => setSelectedNote(null)}>
          <article role="dialog" aria-modal="true" aria-label={selectedNote.title} className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#111a2c] p-6 text-slate-100 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-bold">{selectedNote.title}</h2>
            <p className="mb-4 mt-1 font-mono text-xs text-slate-400">{selectedNote.date}</p>
            <div className="whitespace-pre-wrap text-sm leading-7">{selectedNote.content}</div>
            <button className="mt-6 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950" onClick={() => setSelectedNote(null)}>Close</button>
          </article>
        </div>
      )}
    </section>
  );
}

export default NotesPage;
