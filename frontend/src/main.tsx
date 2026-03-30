import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import { TransactionProvider } from './context/TransactionContext';
import { DashboardProvider } from './context/DashboardContext';
import { BudgetProvider } from './context/BudgetContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CategoryProvider>
          <TransactionProvider>
            <BudgetProvider>
              <DashboardProvider>
                <App />
              </DashboardProvider>
            </BudgetProvider>
          </TransactionProvider>
        </CategoryProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
