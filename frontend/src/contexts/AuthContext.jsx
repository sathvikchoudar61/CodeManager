import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/api/check-auth');
      if (response.data && response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/api/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      await checkAuth(); // Fetch user profile after setting token
    }
    return response.data;
  };

  const signup = async (data) => {
    const response = await api.post('/api/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      await checkAuth();
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
