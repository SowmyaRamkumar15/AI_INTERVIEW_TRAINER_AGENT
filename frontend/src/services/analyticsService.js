import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const analyticsService = {
  get: async () => {
    const response = await api.get(ENDPOINTS.ANALYTICS.GET);
    return response.data?.data || response.data;
  },
};
