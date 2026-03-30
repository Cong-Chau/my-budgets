import { useEffect, useRef } from 'react';
import { chatApi } from '../api/chatApi';
import { useTransactions } from '../context/TransactionContext';
import { useBudgets } from '../context/BudgetContext';
import { useCategories } from '../context/CategoryContext';

export function useDataSync() {
  const { items: transactions } = useTransactions();
  const { items: budgets } = useBudgets();
  const { items: categories } = useCategories();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return;
    if (transactions.length === 0 && budgets.length === 0 && categories.length === 0) return;

    // Debounce to avoid spamming on rapid changes
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const incomeTotal = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expenseTotal = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      chatApi
        .sync({
          transactions,
          budgets,
          categories,
          summary: { income: incomeTotal, expense: expenseTotal, balance: incomeTotal - expenseTotal },
        })
        .catch(() => {});
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [transactions, budgets, categories]);
}
