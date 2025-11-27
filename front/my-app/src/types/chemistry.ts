export interface ChemicalElement {
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
  message?: string;
}

// Исправляем ChemicalsResponse - убираем success и data
export interface ChemicalsResponse {
  items: ChemicalElement[];
  query?: string;
  total: number;
}

export interface MixingItem {
  id: number;
  element_id: number;
  volume: number;
  element: ChemicalElement;
}

export interface MixingResponse {
  items: MixingItem[];
  total: number;
}

export interface Filters {
  query?: string;
  minPh?: number;
  maxPh?: number;
  minConcentration?: number;
  maxConcentration?: number;
}