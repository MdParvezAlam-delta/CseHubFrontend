/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/apiClient';
import { useAuth } from './AuthContext';

const NotesContext = createContext(null);
const normalize = (note) => ({ ...note, _id: note.id });

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    if (isAuthenticated) {
      api.get('/notes/')
        .then(({ data }) => {
          if (active) setNotes((data.results || data).map(normalize));
        })
        .catch((loadError) => {
          if (active) setError(loadError.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      queueMicrotask(() => {
        if (active) {
          setNotes([]);
          setLoading(false);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated]);

  const addNote = useCallback(async (noteData) => {
    const { data } = await api.post('/notes/', noteData);
    const note = normalize(data);
    setNotes((current) => [note, ...current]);
    return note;
  }, []);

  const editNote = useCallback(async (id, noteData) => {
    const { data } = await api.patch(`/notes/${id}/`, noteData);
    const updated = normalize(data);
    setNotes((current) => current.map((note) => note._id === id ? updated : note));
    return updated;
  }, []);

  const removeNote = useCallback(async (id) => {
    await api.delete(`/notes/${id}/`);
    setNotes((current) => current.filter((note) => note._id !== id));
  }, []);

  const value = useMemo(
    () => ({ notes, loading, error, addNote, editNote, removeNote }),
    [notes, loading, error, addNote, editNote, removeNote]
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
