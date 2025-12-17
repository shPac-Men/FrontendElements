import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const res = await api.mixed.mixedList();
  return res.data;
});

export const fetchOrderDetail = createAsyncThunk('orders/fetchDetail', async (id: number) => {
  const res = await api.mixed.mixedDetail(id);
  return res.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [] as any[], currentOrder: null as any | null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => { state.loading = true; });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      // Подстрой под структуру ответа: action.payload.data или items
      state.list = (action.payload as any).items ?? []; 
    });
    builder.addCase(fetchOrderDetail.fulfilled, (state, action) => {
      state.currentOrder = action.payload;
    });
  }
});

export const ordersReducer = ordersSlice.reducer;
