/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { subjectsService } from '../services/subjectsService';

const SubjectsContext = createContext(null);

export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    subjectsService.getSubjects()
      .then((loadedSubjects) => {
        if (active) {
          setSubjects(loadedSubjects);
          setError('');
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

  const saveSubject = useCallback(async (subject, editingId) => {
    const saved = editingId
      ? await subjectsService.updateSubject(editingId, subject)
      : await subjectsService.createSubject(subject);
    setSubjects((current) => (
      editingId
        ? current.map((item) => item.id === saved.id ? saved : item).sort((a, b) => a.name.localeCompare(b.name))
        : [...current, saved].sort((a, b) => a.name.localeCompare(b.name))
    ));
    return saved;
  }, []);

  const deleteSubject = useCallback(async (id) => {
    await subjectsService.deleteSubject(id);
    setSubjects((current) => current.filter((subject) => subject.id !== id));
  }, []);

  const value = useMemo(
    () => ({ subjects, loading, error, saveSubject, deleteSubject }),
    [subjects, loading, error, saveSubject, deleteSubject]
  );

  return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>;
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) throw new Error('useSubjects must be used within SubjectsProvider');
  return context;
}
