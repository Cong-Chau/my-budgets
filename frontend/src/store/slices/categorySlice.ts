import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from '../../api/categoryApi';
import type { Category, CategoryType } from '../../types';

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = { items: [], loading: false, error: null };

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (type?: CategoryType) => categoryApi.getAll(type),
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data: { name: string; type: CategoryType }, { rejectWithValue }) => {
    try {
      return await categoryApi.create(data);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  },
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: number; data: { name?: string; type?: CategoryType } }, { rejectWithValue }) => {
    try {
      return await categoryApi.update(id, data);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      return id;
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  },
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (s) => { s.loading = true; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchCategories.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(createCategory.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateCategory.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteCategory.fulfilled, (s, a) => {
        s.items = s.items.filter((c) => c.id !== a.payload);
      });
  },
});

export default categorySlice.reducer;
