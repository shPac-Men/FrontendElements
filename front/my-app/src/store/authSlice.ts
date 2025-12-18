import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import { resetFilters } from './filterSlice'; // <--- Импортируем экшен сброса
import type { 
  HandlerLoginRequest, 
  HandlerLoginResponse, 
  HandlerRegisterRequest, 
  HandlerUserInfo, 
  HandlerUpdateUserRequest 
} from "../api/Api";

const TOKEN_KEY = "accessToken";

export const login = createAsyncThunk<HandlerUserInfo, HandlerLoginRequest>(
  "auth/login",
  async (dto, { dispatch }) => { // <--- 1. Добавляем { dispatch } вторым аргументом
    const res = await api.auth.loginCreate(dto);
    const data: HandlerLoginResponse = res.data;
    const token = data.token ?? "";
    
    if (token) localStorage.setItem(TOKEN_KEY, token);
    api.setSecurityData(token ? { token } : null);
    
    // <--- 2. ДОБАВЛЯЕМ СБРОС ФИЛЬТРОВ ПРИ ВХОДЕ
    console.log("LOGIN: Сбрасываем фильтры после успешного входа");
    dispatch(resetFilters()); 
    // ----------------------------------------

    return data.user ?? {};
  }
);

export const register = createAsyncThunk<void, HandlerRegisterRequest>(
  "auth/register",
  async (dto) => {
    await api.auth.registerCreate(dto);
  }
);

export const loadProfile = createAsyncThunk<HandlerUserInfo>(
  "auth/loadProfile",
  async () => {
    const res = await api.auth.profileList();
    // Адаптируйте под структуру ответа вашего бэка
    return (res.data as any).data ?? res.data ?? {};
  }
);

export const updateProfile = createAsyncThunk<void, HandlerUpdateUserRequest>(
  "auth/updateProfile",
  async (dto) => {
    await api.auth.profileUpdate(dto);
  }
);

// --- ИСПРАВЛЕННЫЙ LOGOUT ---
export const logout = createAsyncThunk(
  "auth/logout", 
  async (_, { dispatch }) => { // Добавляем { dispatch }
    console.log("AUTH: Logout started");
    try { await api.auth.logoutCreate(); } catch(e) {/* ignore */}
    
    localStorage.removeItem(TOKEN_KEY);
    api.setSecurityData(null);
    
    // Сбрасываем фильтры при выходе
    console.log("AUTH: Dispatching resetFilters");
    dispatch(resetFilters());
  }
);

type AuthState = {
  user: HandlerUserInfo | null;
  status: "idle" | "pending" | "failed";
  error: string | null;
};

const initialState: AuthState = { user: null, status: "idle", error: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initFromLocalStorage(state) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) api.setSecurityData({ token });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = "pending"; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.status = "idle"; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message || "Ошибка входа"; })
      .addCase(loadProfile.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; });
  },
});

export const { initFromLocalStorage } = authSlice.actions;
export const authReducer = authSlice.reducer;
