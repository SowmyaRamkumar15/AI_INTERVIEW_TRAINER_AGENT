import api from '../services/api/axiosConfig';
import { useState, useCallback } from 'react';

/**
 * Generic axios hook.
 * Usage:
 *   const { data, loading, error, execute } = useAxios();
 *   await execute(() => api.get('/some-endpoint'));
 */
const useAxios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestFn();
      const unwrapped = response?.data?.data ?? response?.data ?? response;
      setData(unwrapped);
      return unwrapped;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};

export default useAxios;
