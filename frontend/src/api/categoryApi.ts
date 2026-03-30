import api from './axios';
import type { Category, CategoryType } from '../types';

export const categoryApi = {
  getAll: (type?: CategoryType) =>
    api.get<Category[]>('/categories', { params: type ? { type } : {} }).then((r) => r.data),

  create: (data: { name: string; type: CategoryType }) =>
    api.post<Category>('/categories', data).then((r) => r.data),

  update: (id: number, data: { name?: string; type?: CategoryType }) =>
    api.patch<Category>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/categories/${id}`).then((r) => r.data),
};
