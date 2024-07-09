import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser } from '../services/authService';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await fetchUser(email, password);
      if (data.length > 0) {
        const user = data[0];
        if (user.status === false) {
          return thunkAPI.rejectWithValue('Tài khoản bị khóa');
        }
        return user;
      } else {
        return thunkAPI.rejectWithValue('Sai tài khoản hoặc mật khẩu');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    status: 'idle',
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;