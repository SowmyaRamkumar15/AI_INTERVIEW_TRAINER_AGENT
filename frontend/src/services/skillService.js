import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const skillService = {
  getAll: async () => {
    const response = await api.get(ENDPOINTS.SKILLS.GET_ALL);
    return response.data?.data || [];
  },

  addSkill: async (skillName, proficiency) => {
    const response = await api.post(ENDPOINTS.SKILLS.ADD, { skillName, proficiency });
    return response.data?.data || response.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`${ENDPOINTS.SKILLS.DELETE}/${id}`);
    return response.data;
  },
};
