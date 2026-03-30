import { createContext, useContext, useState, useCallback } from 'react';
import { categoryApi } from '../api/categoryApi';
import type { Category, CategoryType } from '../types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

interface CategoryContextType extends CategoryState {
  fetchCategories: (type?: CategoryType) => Promise<void>;
  createCategory: (data: { name: string; type: CategoryType }) => Promise<void>;
  updateCategory: (id: number, data: { name?: string; type?: CategoryType }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CategoryState>({ items: [], loading: false, error: null });

  const fetchCategories = useCallback(async (type?: CategoryType) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const items = await categoryApi.getAll(type);
      setState({ items, loading: false, error: null });
    } catch (error) {
      const e = error as ApiError;
      setState((s) => ({
        ...s,
        loading: false,
        error: e.response?.data?.message || 'Thất bại',
      }));
    }
  }, []);

  const createCategory = useCallback(async (data: { name: string; type: CategoryType }) => {
    const item = await categoryApi.create(data);
    setState((s) => ({ ...s, items: [...s.items, item] }));
  }, []);

  const updateCategory = useCallback(
    async (id: number, data: { name?: string; type?: CategoryType }) => {
      const item = await categoryApi.update(id, data);
      setState((s) => ({ ...s, items: s.items.map((c) => (c.id === id ? item : c)) }));
    },
    [],
  );

  const deleteCategory = useCallback(async (id: number) => {
    await categoryApi.delete(id);
    setState((s) => ({ ...s, items: s.items.filter((c) => c.id !== id) }));
  }, []);

  return (
    <CategoryContext.Provider
      value={{ ...state, fetchCategories, createCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories phải được dùng trong CategoryProvider');
  return ctx;
}
