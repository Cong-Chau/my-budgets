import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = { user: null, loading: false, error: null };

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name?: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  },
);

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authApi.getMe();
  } catch {
    return rejectWithValue('Not authenticated');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try { await authApi.logout(); } catch (error) { console.error('Logout failed:', error); }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(fetchMe.rejected, (s) => { s.user = null; })
      .addCase(logout.fulfilled, (s) => { s.user = null; });
  },
});

export default authSlice.reducer;
