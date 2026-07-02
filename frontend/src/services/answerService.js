import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const answerService = {
  submit: async (questionId, answer) => {
    const response = await api.post(ENDPOINTS.QUESTIONS.SUBMIT_ANSWER, { questionId, userAnswer: answer });
    return response.data?.data || response.data;
  },
};
