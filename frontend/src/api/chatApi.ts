import api from './axios';
import type { Transaction, Budget, Category } from '../types';

export interface FinancialSnapshot {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  summary: { income: number; expense: number; balance: number };
}

export const chatApi = {
  sync: (data: FinancialSnapshot) =>
    api.post<{ synced: boolean }>('/chat/sync', data).then((r) => r.data),

  sendMessage: (message: string) =>
    api.post<{ reply: string }>('/chat/message', { message }).then((r) => r.data),
};
