import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const dashboardService = {
  getData: async () => {
    const response = await api.get(ENDPOINTS.DASHBOARD.GET_DATA);
    return response.data?.data || response.data;
  },
};
