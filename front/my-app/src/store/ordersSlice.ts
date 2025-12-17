import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api'; // Убедись, что путь к api правильный

// Тип для заявки (подсмотри точные поля в Swagger, если они есть, или используй any пока что)
// Обычно там есть id, status, items, created_at
export interface Order {
  id: number;
  status: string;
  created_at?: string;
  items?: any[];
  [key: string]: any;
}

interface OrdersState {
  list: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  list: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// 1. Получение списка заявок
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.mixed.mixedList();
      // Обычно список лежит в response.data.data или response.data.items
      // Если response.data это массив, то берем его
      // Адаптируй эту строчку под реальный ответ бэкенда:
      const data = response.data as any; 
      return (data.items || data.data || []) as Order[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заявок');
    }
  }
);

// 2. Получение деталей одной заявки
export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.mixed.mixedDetail(id);
      // Аналогично, смотрим где лежит объект
      const data = response.data as any;
      return (data.data || data) as Order;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заявки');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    // Список
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Детали
    builder.addCase(fetchOrderDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
