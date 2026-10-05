import NoteCard from './NoteCard';

function NoteList({ notes, onEdit, onDelete, onOpen }) {
  if (!notes.length) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
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