import { createContext, useContext, useState, useCallback } from "react";
import { transactionApi, type TransactionFilter } from "../api/transactionApi";
import type { Transaction, TransactionType } from "../types";

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

interface TransactionContextType extends TransactionState {
  fetchTransactions: (filter?: TransactionFilter) => Promise<void>;
  createTransaction: (data: {
    amount: number;
    type: TransactionType;
    categoryId: number;
    date: string;
    note?: string;
  }) => Promise<void>;
  updateTransaction: (
    id: number,
    data: Partial<{
      amount: number;
      type: TransactionType;
      categoryId: number;
      date: string;
      note: string;
    }>,
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<TransactionState>({
    items: [],
    loading: false,
    error: null,
  });

  const fetchTransactions = useCallback(async (filter?: TransactionFilter) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const items = await transactionApi.getAll(filter);
      setState({ items, loading: false, error: null });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setState((s) => ({
        ...s,
        loading: false,
        error: err.response?.data?.message || "Thất bại",
      }));
    }
  }, []);

  const createTransaction = useCallback(
    async (data: {
      amount: number;
      type: TransactionType;
      categoryId: number;
      date: string;
      note?: string;
    }) => {
      const item = await transactionApi.create(data);
      setState((s) => ({ ...s, items: [item, ...s.items] }));
    },
    [],
  );

  const updateTransaction = useCallback(
    async (
      id: number,
      data: Partial<{
        amount: number;
        type: TransactionType;
        categoryId: number;
        date: string;
        note: string;
      }>,
    ) => {
      const item = await transactionApi.update(id, data);
      setState((s) => ({
        ...s,
        items: s.items.map((t) => (t.id === id ? item : t)),
      }));
    },
    [],
  );

  const deleteTransaction = useCallback(async (id: number) => {
    await transactionApi.delete(id);
    setState((s) => ({ ...s, items: s.items.filter((t) => t.id !== id) }));
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransactions phải được dùng trong TransactionProvider");
  return ctx;
}
