import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('smartsupport_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  const persistSession = (authResponse) => {
    localStorage.setItem('smartsupport_token', authResponse.token);
    const userInfo = {
      id: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    };
    localStorage.setItem('smartsupport_user', JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      return persistSession(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const res = await registerUser(payload);
      return persistSession(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('smartsupport_token');
    localStorage.removeItem('smartsupport_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
