import React from 'react';
import NoteCard from './NoteCard';

function NoteList({ notes, onEdit, onDelete, onOpen }) {
  if (!notes.length) {
    return <p className="text-sm opacity-70">No notes found.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export default NoteList;