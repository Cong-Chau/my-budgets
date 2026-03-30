import api from './axios';
import type { Budget, BudgetPeriod } from '../types';

export const budgetApi = {
  getAll: () => api.get<Budget[]>('/budgets').then((r) => r.data),

  create: (data: { categoryId: number; amount: number; period: BudgetPeriod }) =>
    api.post<Budget>('/budgets', data).then((r) => r.data),

  update: (id: number, data: Partial<{ categoryId: number; amount: number; period: BudgetPeriod }>) =>
    api.patch<Budget>(`/budgets/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/budgets/${id}`).then((r) => r.data),
};
