import { createContext, useContext, useState, useCallback } from 'react';
import { budgetApi } from '../api/budgetApi';
import type { Budget, BudgetPeriod } from '../types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface BudgetState {
  items: Budget[];
  loading: boolean;
  error: string | null;
}

interface BudgetContextType extends BudgetState {
  fetchBudgets: () => Promise<void>;
  createBudget: (data: { categoryId: number; amount: number; period: BudgetPeriod }) => Promise<void>;
  updateBudget: (id: number, data: Partial<{ categoryId: number; amount: number; period: BudgetPeriod }>) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BudgetState>({ items: [], loading: false, error: null });

  const fetchBudgets = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const items = await budgetApi.getAll();
      setState({ items, loading: false, error: null });
    } catch (error) {
      const e = error as ApiError;
      setState((s) => ({ ...s, loading: false, error: e.response?.data?.message || 'Thất bại' }));
    }
  }, []);

  const createBudget = useCallback(async (data: { categoryId: number; amount: number; period: BudgetPeriod }) => {
    const item = await budgetApi.create(data);
    setState((s) => ({ ...s, items: [item, ...s.items] }));
  }, []);

  const updateBudget = useCallback(async (id: number, data: Partial<{ categoryId: number; amount: number; period: BudgetPeriod }>) => {
    const item = await budgetApi.update(id, data);
    setState((s) => ({ ...s, items: s.items.map((b) => (b.id === id ? item : b)) }));
  }, []);

  const deleteBudget = useCallback(async (id: number) => {
    await budgetApi.delete(id);
    setState((s) => ({ ...s, items: s.items.filter((b) => b.id !== id) }));
  }, []);

  return (
    <BudgetContext.Provider value={{ ...state, fetchBudgets, createBudget, updateBudget, deleteBudget }}>
      {children}
    </BudgetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBudgets() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudgets phải được dùng trong BudgetProvider');
  return ctx;
}
