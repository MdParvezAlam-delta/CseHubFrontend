import React, { createContext, useContext, useEffect, useState } from 'react';
import { notesService } from '../services/notesService';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notesService.getAllNotes();
      setNotes(data.notes || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (noteData) => {
    const data = await notesService.createNote(noteData);
    setNotes((prev) => [data.note, ...prev]);
    return data;
  };

  const editNote = async (id, noteData) => {
    const data = await notesService.updateNote(id, noteData);
    setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    return data;
  };

  const removeNote = async (id) => {
    await notesService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <NotesContext.Provider
      value={{ notes, loading, error, fetchNotes, addNote, editNote, removeNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);