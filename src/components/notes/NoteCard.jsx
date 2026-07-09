import React from 'react';

function NoteCard({ note, onEdit, onDelete, onOpen }) {
  return (
    <div className="rounded-xl border p-4 bg-white/5">
      <div className="mb-3">
        <h3 className="text-lg font-bold">{note.title}</h3>
        <p className="text-sm opacity-70">{note.date}</p>
      </div>

      <p className="text-sm line-clamp-3 opacity-90">{note.content}</p>

      <div className="mt-4 flex gap-2">
        <button onClick={() => onOpen(note)} className="px-3 py-1 rounded bg-blue-500 text-white">
          Open
        </button>
        <button onClick={() => onEdit(note)} className="px-3 py-1 rounded bg-amber-500 text-white">
          Edit
        </button>
        <button onClick={() => onDelete(note._id)} className="px-3 py-1 rounded bg-red-500 text-white">
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;