import { createContext, useContext, useState, useCallback } from "react";
import { dashboardApi } from "../api/dashboardApi";
import type { DashboardData } from "../types";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
}

interface DashboardContextType extends DashboardState {
  fetchDashboard: (params?: {
    dateFrom?: string;
    dateTo?: string;
  }) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: false,
  });

  const fetchDashboard = useCallback(
    async ({
      dateFrom,
      dateTo,
    }: { dateFrom?: string; dateTo?: string } = {}) => {
      setState((s) => ({ ...s, loading: true }));
      try {
        const data = await dashboardApi.getSummary(dateFrom, dateTo);
        setState({ data, loading: false });
      } catch {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    [],
  );

  return (
    <DashboardContext.Provider value={{ ...state, fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard phải được dùng trong DashboardProvider");
  return ctx;
}
