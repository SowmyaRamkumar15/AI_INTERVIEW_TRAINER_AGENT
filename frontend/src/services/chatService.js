import api from './api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const chatService = {
  sendMessage: async (message) => {
    // Backend: ApiResponse<ChatResponse> = { success, message, data: { response: "..." } }
    // Axios adds its own .data layer, so response.data = { success, message, data: { response } }
    const response = await api.post(ENDPOINTS.CHAT.SEND_MESSAGE, { message });
    return response.data; // return the full ApiResponse so consumers can do .data.response
  },
  getHistory: async () => {
    // Backend: ApiResponse<List<ChatHistory>> = { success, message, data: [...] }
    const response = await api.get(ENDPOINTS.CHAT.HISTORY);
    return response.data; // return full ApiResponse so consumers can do .data
  },
};
