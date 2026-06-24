import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(() => {
    const saved = localStorage.getItem('adminInfo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (adminInfo) {
      localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    } else {
      localStorage.removeItem('adminInfo');
    }
  }, [adminInfo]);

  const login = (data) => {
    setAdminInfo({ ...data, isAdmin: true });
  };

  const logout = () => {
    setAdminInfo(null);
  };

  return (
    <AuthContext.Provider value={{ adminInfo, login, logout, isAdmin: !!adminInfo?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
