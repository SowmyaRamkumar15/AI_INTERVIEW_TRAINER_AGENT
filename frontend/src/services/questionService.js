import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const questionService = {
  getAll: async ({ page = 0, size = 10, role, difficulty, company } = {}) => {
    const params = { page, size };
    if (role) params.role = role;
    if (difficulty) params.difficulty = difficulty;
    if (company) params.company = company;
    const response = await api.get(ENDPOINTS.QUESTIONS.GET_ALL, { params });
    return response.data?.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINTS.QUESTIONS.GET_BY_ID}/${id}`);
    return response.data?.data || response.data;
  },

  submitAnswer: async (questionId, answer) => {
    const response = await api.post(ENDPOINTS.QUESTIONS.SUBMIT_ANSWER, { questionId, answer });
    return response.data?.data || response.data;
  },
};
