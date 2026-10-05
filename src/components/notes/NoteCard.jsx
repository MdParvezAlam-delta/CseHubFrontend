function NoteCard({ note, onEdit, onDelete, onOpen }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-[#111a2c] p-4">
      <div className="mb-3">
        <h3 className="text-base font-bold text-white">{note.title}</h3>
        <p className="mt-1 font-mono text-[10px] text-slate-400">{note.date}</p>
      </div>

      <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-slate-300">{note.content}</p>

      <div className="mt-4 flex gap-2 border-t border-slate-700/60 pt-3">
        <button onClick={() => onOpen(note)} className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10">
          Open
        </button>
        <button onClick={() => onEdit(note)} className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">
          Edit
        </button>
        <button onClick={() => onDelete(note._id)} className="rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10">
          Delete
        </button>
      </div>
    </article>
  );
}

export default NoteCard;