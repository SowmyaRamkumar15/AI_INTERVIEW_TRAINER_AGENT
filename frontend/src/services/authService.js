import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (email, password) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },
  register: async (name, email, password, role) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, { name, email, password, role });
    return response.data;
  },
  logout: async (email) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT, null, { params: { email } });
    return response.data;
  },
};
