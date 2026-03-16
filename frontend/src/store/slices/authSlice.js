import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "@services/authService";

const JWT_KEY = import.meta.env.VITE_JWT_KEY || "learnhub_jwt_token";

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await loginUser(credentials);
      localStorage.setItem(JWT_KEY, result.token);
      return result.user;
    } catch (err) {
      return rejectWithValue(err.message || "Login failed.");
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
  localStorage.removeItem(JWT_KEY);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    null,
    loading: false,
    error:   null,
  },
  reducers: {
    setUser:   (state, action) => { state.user  = action.payload; },
    clearUser: (state)         => { state.user  = null; state.error = null; },
    clearError:(state)         => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginAsync.fulfilled, (s, a) => { s.loading = false; s.user  = a.payload; })
      .addCase(loginAsync.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(logoutAsync.fulfilled,(s)    => { s.user    = null; });
  },
});

export const { setUser, clearUser, clearError } = authSlice.actions;
export default authSlice.reducer;
