import api from './apiClient';

export const subjectsService = {
  async getSubjects() {
    const { data } = await api.get('/subjects/');
    // Handle API response format: { results: [...] } or [...]
    // Also handle error cases where data might not be an array
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    // If we get here, the response format is unexpected
    // Return empty array to prevent mapping errors in UI
    console.warn('Unexpected subjects API response format:', data);
    return [];
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
