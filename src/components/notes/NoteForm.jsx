import React, { useState } from 'react';

function NoteForm({ onSubmit, initialValues = {}, buttonText = 'Save Note' }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [date, setDate] = useState(initialValues.date || '');
  const [content, setContent] = useState(initialValues.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full rounded-lg border px-4 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
      />
      <input
        className="w-full rounded-lg border px-4 py-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <textarea
        className="w-full rounded-lg border px-4 py-2 min-h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />
      <button className="rounded-lg bg-primary px-5 py-2 text-white" type="submit">
        {buttonText}
      </button>
    </form>
  );
}

export default NoteForm;