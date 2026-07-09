import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const roadmapService = {
  get: async () => {
    const response = await api.get(ENDPOINTS.ROADMAP.GET_ALL);
    return response.data?.data || [];
  },
  
  add: async (itemData) => {
    const response = await api.post(ENDPOINTS.ROADMAP.ADD, itemData);
    return response.data?.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(ENDPOINTS.ROADMAP.UPDATE_STATUS(id), null, {
      params: { status }
    });
    return response.data?.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(ENDPOINTS.ROADMAP.DELETE(id));
    return response.data?.data;
  }
};
