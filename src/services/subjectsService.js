import api from './apiClient';

export const subjectsService = {
  async getSubjects() {
    const { data } = await api.get('/subjects/');
    return data.results || data;
  },

  async createSubject(subject) {
    const { data } = await api.post('/subjects/', subject);
    return data;
  },

  async updateSubject(id, subject) {
    const { data } = await api.patch(`/subjects/${id}/`, subject);
    return data;
  },

  async deleteSubject(id) {
    await api.delete(`/subjects/${id}/`);
  },
};
