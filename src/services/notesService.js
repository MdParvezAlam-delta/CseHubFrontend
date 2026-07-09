import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const notesService = {
  getAllNotes: async () => {
    const res = await axios.get(`${API_URL}/notes`, getAuthHeaders());
    return res.data;
  },

  getNoteById: async (id) => {
    const res = await axios.get(`${API_URL}/notes/${id}`, getAuthHeaders());
    return res.data;
  },

  createNote: async (noteData) => {
    const res = await axios.post(`${API_URL}/notes`, noteData, getAuthHeaders());
    return res.data;
  },

  updateNote: async (id, noteData) => {
    const res = await axios.put(`${API_URL}/notes/${id}`, noteData, getAuthHeaders());
    return res.data;
  },

  deleteNote: async (id) => {
    const res = await axios.delete(`${API_URL}/notes/${id}`, getAuthHeaders());
    return res.data;
  }
};