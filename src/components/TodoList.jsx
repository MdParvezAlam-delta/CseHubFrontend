import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchTodos = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('csehub-token') || localStorage.getItem('token');
      console.log('Token found:', !!token);
      console.log('Is Authenticated:', isAuthenticated);
      
      if (token && isAuthenticated) {
        console.log('Fetching todos from API...');
        const res = await axios.get(`${API_URL}/todos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Todos received:', res.data.todos);
        setTodos(res.data.todos);
      } else {
        console.log('No token or not authenticated');
        setTodos([]);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch todos';
      console.error('Failed to fetch todos:', errorMsg);
      setError(errorMsg);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [isAuthenticated]);

  const handleAddTodoClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/signup');
      return;
    }
    addTodo(e);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const token = localStorage.getItem('csehub-token') || localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${API_URL}/todos`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([res.data.todo, ...todos]);
      setTitle('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleTodo = (todo) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    toggleTodo(todo);
  };

  const toggleTodo = async (todo) => {
    const token = localStorage.getItem('csehub-token') || localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/todos/${todo._id}`,
        { completed: !todo.completed, title: todo.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map(t => (t._id === todo._id ? res.data.todo : t)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleEditClick = (todo) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  const handleSaveEdit = async (todoId) => {
    if (!editingTitle.trim()) return;
    
    const token = localStorage.getItem('csehub-token') || localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/todos/${todoId}`,
        { title: editingTitle, completed: todos.find(t => t._id === todoId)?.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map(t => (t._id === todoId ? res.data.todo : t)));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = (id) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    deleteTodo(id);
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('csehub-token') || localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">
      <div className="text-gray-500">Loading...</div>
    </div>;
  }

  if (error && isAuthenticated) {
    return <div className="flex justify-center items-center py-8">
      <div className="text-red-500 text-center">
        <p className="font-semibold">Error loading todos</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-2">Make sure the backend server is reachable.</p>
      </div>
    </div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
     

      {/* My To-Do Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">My To-Do</h2>
        
        {/* Add Todo Form */}
        <form onSubmit={handleAddTodoClick} className="flex gap-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={() => !isAuthenticated && navigate('/signup')}
            placeholder={isAuthenticated ? 'Add Task Name...' : 'Login to add a todo'}
            disabled={!isAuthenticated}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
              !isAuthenticated 
                ? 'border-gray-400 bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'border-cyan-400 bg-white text-gray-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-300'
            }`}
          />
          <button 
            type="submit"
            disabled={!isAuthenticated}
            className={`px-8 py-2 rounded-lg font-semibold transition-all ${
              isAuthenticated 
                ? 'bg-cyan-400 text-white hover:bg-cyan-500 cursor-pointer shadow-md hover:shadow-lg' 
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            Add Task
          </button>
        </form>

        {/* Authentication prompt for non-authenticated users */}
        {!isAuthenticated && todos.length === 0 && (
          <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-cyan-200">
            <p className="text-gray-600 mb-4 font-medium">Sign in or create an account to manage your todos</p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-cyan-400 text-white px-6 py-2 rounded-lg hover:bg-cyan-500 font-semibold transition-all shadow-md"
            >
              Sign Up / Login
            </button>
          </div>
        )}
      </div>

      {/* Current Tasks Section */}
      {todos.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Current Tasks</h3>
          
          <div className="space-y-3">
            {todos.map(todo => (
              <div
                key={todo._id}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo)}
                  disabled={!isAuthenticated}
                  className="w-5 h-5 text-cyan-400 rounded cursor-pointer disabled:cursor-not-allowed"
                />

                {/* Todo Title / Edit Input */}
                {editingId === todo._id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-3 py-1 border border-cyan-400 rounded focus:outline-none focus:ring-1 focus:ring-cyan-300"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(todo._id)}
                      className="px-3 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-500 text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(todo)}
                    disabled={!isAuthenticated || editingId !== null}
                    title="Edit"
                    className={`p-2 rounded transition-all ${
                      isAuthenticated && editingId === null
                        ? 'text-blue-500 hover:bg-blue-50 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ✎
                  </button>

                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    disabled={!isAuthenticated}
                    title="Delete"
                    className={`p-2 rounded transition-all ${
                      isAuthenticated
                        ? 'text-red-500 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for authenticated users */}
      {isAuthenticated && todos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No todos yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}

export default TodoList;