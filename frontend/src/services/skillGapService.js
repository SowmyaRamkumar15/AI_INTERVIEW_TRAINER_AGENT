import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const skillGapService = {
  analyze: async (targetRole) => {
    const response = await api.post(ENDPOINTS.SKILL_GAP.ANALYZE, { targetRole });
    return response.data?.data || response.data;
  },

  get: async () => {
    const response = await api.get(ENDPOINTS.SKILL_GAP.GET);
    return response.data?.data || [];
  },
};
