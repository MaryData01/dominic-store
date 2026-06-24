import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const UserAuthContext = createContext();

export const useUserAuth = () => useContext(UserAuthContext);

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userInfo');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser(null);
          }
        }

        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('userInfo', JSON.stringify(res.data));
        } catch (error) {
          console.error('Session restoration failed:', error);
          logoutSilent();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('userToken', userToken);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('userToken', userToken);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      toast.success(`Account created! Welcome, ${userData.name}!`);
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logoutSilent = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setToken(null);
    setUser(null);
  };

  const logout = () => {
    logoutSilent();
    toast.success('Logged out successfully');
  };

  return (
    <UserAuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};
