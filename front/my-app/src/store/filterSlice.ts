import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Filters } from '../types/chemistry'; 

// Начальное состояние
const initialState: Filters = {
  query: '', // <-- Исправлено: используем query
  minPh: undefined,
  maxPh: undefined,
  minConcentration: undefined,
  maxConcentration: undefined,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Переименовали setSearchQuery -> setQuery для ясности, 
    // но можно оставить старое имя, главное менять поле state.query
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload; // <-- Исправлено: пишем в state.query
    },
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      return { ...state, ...action.payload };
    },
    resetSearchQuery(state) {
      state.query = ''; // <-- Исправлено
    },
    resetFilters(state) {
      console.log('REDUX: СБРОС ФИЛЬТРОВ');
      // Явный сброс всех полей
      state.query = '';
      state.minPh = undefined;
      state.maxPh = undefined;
      state.minConcentration = undefined;
      state.maxConcentration = undefined;
    },
  },
});

export const { setSearchQuery, resetSearchQuery, resetFilters, setFilters } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
