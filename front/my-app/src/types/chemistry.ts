export interface ChemicalElement {
  id: number;
  name: string;
  description: string;
  ph: number;
  concentration: number;
  image: string;
}

export interface ChemicalsResponse {
  success: boolean;
  data: {
    items: ChemicalElement[];
    query?: string;
    total: number;
  };
}

export interface Filters {
  query?: string;
  minPh?: number;
  maxPh?: number;
  minConcentration?: number;
  maxConcentration?: number;
}