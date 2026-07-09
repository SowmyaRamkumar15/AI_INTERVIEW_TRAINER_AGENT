import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const mockInterviewService = {
  startInterview: async ({ role, difficulty, company, experience, numberOfQuestions }) => {
    const response = await api.post(ENDPOINTS.MOCK_INTERVIEW.START, {
      role,
      difficulty,
      company: company || 'General',
      experience: experience || '0-2 years',
      numberOfQuestions: numberOfQuestions || 3,
    });
    return response.data?.data || response.data;
  },

  getHistory: async () => {
    const response = await api.get(ENDPOINTS.MOCK_INTERVIEW.HISTORY);
    const resultData = response.data;
    // Check if the array is wrapped in a 'data' property (ApiResponse), or returned directly
    return Array.isArray(resultData) ? resultData : (resultData?.data || []);
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINTS.MOCK_INTERVIEW.GET_BY_ID}/${id}`);
    return response.data?.data || response.data;
  },
};
