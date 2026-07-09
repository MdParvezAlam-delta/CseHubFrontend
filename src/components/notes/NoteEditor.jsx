import React from 'react';
import NoteForm from './NoteForm';

function NoteEditor({ note, onSave }) {
  return (
    <div className="rounded-xl border p-5">
      <NoteForm
        initialValues={note}
        buttonText="Update Note"
        onSubmit={(data) => onSave(note._id, data)}
      />
    </div>
  );
}

export default NoteEditor;