import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteForm from '../components/notes/NoteForm';
import NoteList from '../components/notes/NoteList';
import NoteEditor from '../components/notes/NoteEditor';

function NotesPage() {
  const { notes, loading, error, addNote, editNote, removeNote } = useNotes();
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleCreate = async (data) => {
    await addNote(data);
  };

  const handleUpdate = async (id, data) => {
    await editNote(id, data);
    setEditingNote(null);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black mb-6">Notebook</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <div className="rounded-xl border p-5">
            <h2 className="text-xl font-bold mb-4">Create Note</h2>
            <NoteForm onSubmit={handleCreate} buttonText="Create Note" />
          </div>

          {editingNote && (
            <div className="rounded-xl border p-5">
              <h2 className="text-xl font-bold mb-4">Edit Note</h2>
              <NoteEditor note={editingNote} onSave={handleUpdate} />
            </div>
          )}
        </div>

        <div>
          {loading && <p>Loading notes...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <NoteList
            notes={notes}
            onEdit={setEditingNote}
            onDelete={removeNote}
            onOpen={setSelectedNote}
          />
        </div>
      </div>

      {selectedNote && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold mb-2">{selectedNote.title}</h2>
            <p className="text-sm opacity-70 mb-4">{selectedNote.date}</p>
            <div className="whitespace-pre-wrap">{selectedNote.content}</div>
            <button
              className="mt-6 px-4 py-2 rounded bg-primary text-white"
              onClick={() => setSelectedNote(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default NotesPage;