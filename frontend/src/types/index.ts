export type CategoryType = 'INCOME' | 'EXPENSE';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: number;
  email: string;
  name?: string;
  isFirstTime?: boolean;
}

export interface CategoryBudget {
  id: number;
  amount: number;
  period: BudgetPeriod;
  totalSpent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  userId: number;
  createdAt: string;
  budget: CategoryBudget | null;
}

export interface Transaction {
  id: number;
  amount: string;
  type: TransactionType;
  categoryId: number;
  category: { id: number; name: string; type: CategoryType };
  userId: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: { name: string; value: number }[];
  cashflow: { month: string; income: number; expense: number }[];
}

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY';
export type BudgetStatus = 'safe' | 'warning' | 'exceeded';

export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  category: { id: number; name: string; type: CategoryType };
  amount: number;
  period: BudgetPeriod;
  totalSpent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
