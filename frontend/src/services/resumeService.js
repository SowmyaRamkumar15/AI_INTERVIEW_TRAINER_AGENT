import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const resumeService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(ENDPOINTS.RESUME.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },

  getAll: async () => {
    const response = await api.get(ENDPOINTS.RESUME.GET_ALL);
    return response.data?.data || [];
  },

  deleteResume: async (id) => {
    const response = await api.delete(`${ENDPOINTS.RESUME.DELETE}/${id}`);
    return response.data;
  },
};
