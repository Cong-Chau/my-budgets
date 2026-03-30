import api from './axios';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  getMe: () => api.get<User>('/auth/me').then((r) => r.data),

  updateProfile: (data: { name?: string }) =>
    api.patch<{ id: number; name?: string }>('/users/profile', data).then((r) => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<{ message: string }>('/users/password', data).then((r) => r.data),
};
