import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const roadmapService = {
  get: async () => {
    const response = await api.get(ENDPOINTS.ROADMAP.GET);
    return response.data?.data || [];
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`${ENDPOINTS.ROADMAP.UPDATE_STATUS}/${id}`, { status });
    return response.data?.data || response.data;
  },
};
