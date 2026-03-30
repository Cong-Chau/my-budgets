import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { onboardingApi } from '../api/onboardingApi';
import type { User } from '../types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; message: string }>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: false, error: null });

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      setState({ user: res.user, loading: false, error: null });
      return true;
    } catch (error) {
      const e = error as ApiError;
      setState((s) => ({
        ...s,
        loading: false,
        error: e.response?.data?.message || 'Đăng nhập thất bại',
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.register({ email, password, name });
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      setState({ user: res.user, loading: false, error: null });
      return true;
    } catch (error) {
      const e = error as ApiError;
      setState((s) => ({
        ...s,
        loading: false,
        error: e.response?.data?.message || 'Đăng ký thất bại',
      }));
      return false;
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      setState((s) => ({ ...s, user }));
    } catch {
      setState((s) => ({ ...s, user: null }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setState({ user: null, loading: false, error: null });
  }, []);

  const updateProfile = useCallback(async (name: string) => {
    try {
      await authApi.updateProfile({ name });
      setState((s) => s.user ? { ...s, user: { ...s.user, name } } : s);
      return true;
    } catch {
      return false;
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    await onboardingApi.complete();
    setState((s) => s.user ? { ...s, user: { ...s.user, isFirstTime: false } } : s);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        const res = await authApi.changePassword({ currentPassword, newPassword });
        return { ok: true, message: res.message };
      } catch (error) {
        const e = error as ApiError;
        return {
          ok: false,
          message: e.response?.data?.message || 'Đổi mật khẩu thất bại',
        };
      }
    },
    [],
  );

  return (
    <AuthContext.Provider value={{ ...state, login, register, fetchMe, logout, updateProfile, changePassword, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng trong AuthProvider');
  return ctx;
}
