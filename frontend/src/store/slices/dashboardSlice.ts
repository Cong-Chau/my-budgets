import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../api/dashboardApi';
import type { DashboardData } from '../../types';

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
}

const initialState: DashboardState = { data: null, loading: false };

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async ({ dateFrom, dateTo }: { dateFrom?: string; dateTo?: string } = {}) =>
    dashboardApi.getSummary(dateFrom, dateTo),
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (s) => { s.loading = true; })
      .addCase(fetchDashboard.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
      .addCase(fetchDashboard.rejected, (s) => { s.loading = false; });
  },
});

export default dashboardSlice.reducer;
