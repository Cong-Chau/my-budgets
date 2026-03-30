import api from './axios';
import type { Transaction, TransactionType } from '../types';

export interface TransactionFilter {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  type?: TransactionType;
}

export const transactionApi = {
  getAll: (filter?: TransactionFilter) =>
    api.get<Transaction[]>('/transactions', { params: filter }).then((r) => r.data),

  create: (data: {
    amount: number;
    type: TransactionType;
    categoryId: number;
    date: string;
    note?: string;
  }) => api.post<Transaction>('/transactions', data).then((r) => r.data),

  update: (
    id: number,
    data: {
      amount?: number;
      type?: TransactionType;
      categoryId?: number;
      date?: string;
      note?: string;
    },
  ) => api.patch<Transaction>(`/transactions/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/transactions/${id}`).then((r) => r.data),
};
