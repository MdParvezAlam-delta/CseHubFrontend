import { useEffect, useMemo, useState } from 'react';
import api from '../services/apiClient';

const TAGS = ['Quick', 'Study', 'Code', 'Bug'];
const sampleTasks = [
  { title: 'Review data structures notes', tag: 'Study' },
  { title: 'Solve two graph problems', tag: 'Code' },
  { title: 'Fix mobile navbar spacing', tag: 'Bug' },
];

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Quick');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/todos/')
      .then(({ data }) => {
        if (active) {
          setError('');
          setTodos((data.results || data).map((todo) => ({ ...todo, _id: todo.id })));
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

  const addTodo = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post('/todos/', { title: title.trim(), tag, completed: false });
      setTodos((current) => [{ ...data, _id: data.id }, ...current]);
      setTitle('');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateTodo = async (id, changes) => {
    setError('');
    try {
      const { data } = await api.patch(`/todos/${id}/`, changes);
      setTodos((current) => current.map((todo) => todo._id === id ? { ...data, _id: data.id } : todo));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const deleteTodo = async (id) => {
    setError('');
    try {
      await api.delete(`/todos/${id}/`);
      setTodos((current) => current.filter((todo) => todo._id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const saveEdit = async (todoId) => {
    if (!editingTitle.trim()) return;
    await updateTodo(todoId, { title: editingTitle.trim() });
    setEditingId(null);
    setEditingTitle('');
  };

  const loadSamples = async () => {
    setSaving(true);
    setError('');
    try {
      for (const sample of sampleTasks) {
        const { data } = await api.post('/todos/', { ...sample, completed: false });
        setTodos((current) => [{ ...data, _id: data.id }, ...current]);
      }
    } catch (sampleError) {
      setError(sampleError.message);
    } finally {
      setSaving(false);
    }
  };

  const clearTodos = async () => {
    if (!todos.length || !window.confirm('Delete all your tasks?')) return;
    setSaving(true);
    try {
      await Promise.all(todos.map((todo) => api.delete(`/todos/${todo._id}/`)));
      setTodos([]);
    } catch (clearError) {
      setError(clearError.message);
      const { data } = await api.get('/todos/');
      setTodos((data.results || data).map((todo) => ({ ...todo, _id: todo.id })));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col px-4 py-7 text-slate-100 sm:px-6">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold"><span className="text-cyan-400">●</span> My To-Do</h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-slate-400"><span className="material-symbols-outlined text-sm text-cyan-400">info</span> Your tasks are saved to your account.</p>
        </div>
        <div className="flex gap-4 rounded-xl border border-slate-700 bg-[#111a2c] px-4 py-2 font-mono text-[10px] text-slate-400">
          <span>Total: <strong className="text-cyan-300">{todos.length}</strong></span>
          <span>Completed: <strong className="text-emerald-300">{completedCount}</strong></span>
        </div>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}

      <form onSubmit={addTodo} className="mb-5 rounded-2xl border border-slate-700 bg-[#111a2c] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            required
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="＋  Add task name..."
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#0b1426] px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50">
            <span className="text-base">＋</span> Add Task
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="mr-1 text-slate-400">Tag:</span>
          {TAGS.map((item) => (
            <button key={item} type="button" onClick={() => setTag(item)} className={`rounded-md border px-2 py-1 ${tag === item ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' : 'border-slate-700 bg-[#0b1426] text-slate-300 hover:border-slate-500'}`}>
              #{item}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-slate-400">
            <button type="button" disabled={saving} onClick={loadSamples} className="hover:text-cyan-300 disabled:opacity-50">⇧ Load Sample Tasks</button>
            <span className="text-slate-700">|</span>
            <button type="button" disabled={saving} onClick={clearTodos} className="hover:text-rose-300 disabled:opacity-50">Reset to Empty</button>
          </div>
        </div>
      </form>

      <div className="flex min-h-[420px] flex-1 flex-col rounded-2xl border border-slate-800 bg-[#0b1426] p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Loading tasks...</div>
        ) : todos.length ? (
          <div className="space-y-3">
            {todos.map((todo) => (
              <article key={todo._id} className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-[#111a2c] p-3 sm:p-4">
                <input type="checkbox" checked={todo.completed} onChange={() => updateTodo(todo._id, { completed: !todo.completed })} aria-label={`Mark ${todo.title} ${todo.completed ? 'incomplete' : 'complete'}`} className="h-4 w-4 accent-cyan-400" />
                {editingId === todo._id ? (
                  <div className="flex min-w-0 flex-1 gap-2">
                    <input value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && saveEdit(todo._id)} autoFocus className="min-w-0 flex-1 rounded-lg border border-cyan-500/40 bg-[#0b1426] px-3 py-2 text-sm text-white outline-none" />
                    <button type="button" onClick={() => saveEdit(todo._id)} className="text-xs text-cyan-300">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-xs text-slate-400">Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className={`min-w-0 flex-1 text-sm ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{todo.title}</span>
                    {todo.tag && <span className="rounded border border-slate-700 bg-[#0b1426] px-2 py-1 text-[9px] text-cyan-300">#{todo.tag}</span>}
                    <button type="button" onClick={() => { setEditingId(todo._id); setEditingTitle(todo.title); }} aria-label="Edit task" className="text-slate-400 hover:text-cyan-300">✎</button>
                    <button type="button" onClick={() => deleteTodo(todo._id)} aria-label="Delete task" className="text-slate-400 hover:text-rose-300">×</button>
                  </>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-[#142239] text-cyan-400">
              <span className="material-symbols-outlined text-3xl">assignment_turned_in</span>
            </span>
            <h2 className="text-lg font-bold">No todos yet. Add one to get started!</h2>
            <p className="mt-2 max-w-md text-xs leading-5 text-slate-400">Keep track of quick coding tasks, documentation reading, and developer checklist items in your account.</p>
            <button type="button" onClick={() => document.querySelector('input[placeholder*="Add task name"]')?.focus()} className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-cyan-300 hover:bg-cyan-500/10">＋ Create Your First Task</button>
          </div>
        )}
      </div>
    </section>
  );
}
