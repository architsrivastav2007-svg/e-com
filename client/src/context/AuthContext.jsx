import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, login as loginRequest, register as registerRequest } from '../services/authService.js';
import { getMyProfile as getUserProfile } from '../services/userService.js';

const TOKEN_KEY = 'authToken';

const AuthContext = createContext(null);

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    setToken(nextToken || null);
    setUser(nextUser || null);
    setIsAuthenticated(Boolean(nextToken && nextUser));
  };

  const logout = () => {
    persistAuth(null, null);
  };

  const loadProfile = async () => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setToken(storedToken);
      const data = await getUserProfile();
      const profileUser = data?.user || null;
      persistAuth(storedToken, profileUser);
    } catch (error) {
      persistAuth(null, null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();

    const handleUnauthorized = () => {
      persistAuth(null, null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    persistAuth(data?.token || null, data?.user || null);
    return data;
  };

  const register = async (userData) => {
    const data = await registerRequest(userData);
    persistAuth(data?.token || null, data?.user || null);
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      refreshAuth: loadProfile,
    }),
    [user, token, isAuthenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
