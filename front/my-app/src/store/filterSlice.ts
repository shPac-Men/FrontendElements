
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export interface FilterState {
  searchQuery: string;
}

const initialState: FilterState = {
  searchQuery: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetSearchQuery(state) {
      state.searchQuery = '';
    },
  },
});

export const { setSearchQuery, resetSearchQuery } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
