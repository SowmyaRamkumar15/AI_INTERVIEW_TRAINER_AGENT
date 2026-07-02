import { useState, useCallback } from 'react';
import api from '../services/api/axiosConfig';
import { ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Hook for sending messages to the backend chat endpoint
 * and maintaining local message history.
 */
const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message?.trim()) return;

    const userMsg = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(ENDPOINTS.CHAT.SEND_MESSAGE, { message });
      const reply = response?.data?.data?.response || response?.data?.response || 'No response';
      const botMsg = { role: 'assistant', content: reply, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
      return reply;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, loading, error, sendMessage, clearMessages };
};

export default useChat;
