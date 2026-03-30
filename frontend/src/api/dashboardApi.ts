import api from './axios';
import type { DashboardData } from '../types';

export const dashboardApi = {
  getSummary: (dateFrom?: string, dateTo?: string) =>
    api
      .get<DashboardData>('/dashboard', { params: { dateFrom, dateTo } })
      .then((r) => r.data),
};
