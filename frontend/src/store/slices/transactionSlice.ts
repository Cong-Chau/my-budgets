import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionApi, type TransactionFilter } from '../../api/transactionApi';
import type { Transaction, TransactionType } from '../../types';

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = { items: [], loading: false, error: null };

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filter?: TransactionFilter) => transactionApi.getAll(filter),
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (
    data: { amount: number; type: TransactionType; categoryId: number; date: string; note?: string },
    { rejectWithValue },
  ) => {
    try { return await transactionApi.create(data); }
    catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  },
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async (
    { id, data }: { id: number; data: Partial<{ amount: number; type: TransactionType; categoryId: number; date: string; note: string }> },
    { rejectWithValue },
  ) => {
    try { return await transactionApi.update(id, data); }
    catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: number, { rejectWithValue }) => {
    try { await transactionApi.delete(id); return id; }
    catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  },
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTransactions.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTransactions.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(createTransaction.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateTransaction.fulfilled, (s, a) => {
        const idx = s.items.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteTransaction.fulfilled, (s, a) => {
        s.items = s.items.filter((t) => t.id !== a.payload);
      });
  },
});

export default transactionSlice.reducer;
