// src/modules/types.ts

export interface Element {
  id: number;
  name: string;
  description: string;
  ph: number;
  concentration: number;
  image: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// ← ДОБАВЬТЕ ЭТО:
export interface ElementsResponse {
  items: Element[];
  query: string;
  total: number;
}

export interface MixingItem {
  element_id: number;
  volume: number;
}

export interface MixingResponse {
  id: number;
  element_id: number;
  volume: number;
  element: Element;
}

export interface CartItem extends Element {
  volume: number;
}
