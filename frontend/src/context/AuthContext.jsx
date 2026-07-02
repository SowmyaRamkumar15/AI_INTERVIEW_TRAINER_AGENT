import React, { createContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setRefreshToken, setUser, clearAuth } from '../utils/tokenUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    
    if (token && storedUser) {
      setUserState(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token, refreshToken) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(userData);
    
    setUserState(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
