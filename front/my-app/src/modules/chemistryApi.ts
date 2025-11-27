import type { ChemicalElement, ApiResponse } from '../types/chemistry';

const API_BASE = '/api/v1';

// Mock данные для fallback
export const CHEMICALS_MOCK: ChemicalElement[] = [
  {
    id: 1,
    name: "NaCl",
    description: "Sodium chloride",
    ph: 7.0,
    concentration: 0.15,
    image: "/staticimages/nacl.jpg"
  },
  {
    id: 2,
    name: "HCl", 
    description: "Hydrochloric acid",
    ph: 1.0,
    concentration: 0.5,
    image: "/staticimages/HCl.jpg"
  },
  {
    id: 3,
    name: "H2SO4",
    description: "Sulfuric acid", 
    ph: 0.0,
    concentration: 2.0,
    image: "/staticimages/64352489.jpg"
  },
  {
    id: 5,
    name: "NH3",
    description: "Ammonia",
    ph: 11.0,
    concentration: 1.0,
    image: "/staticimages/nh3.jpg"
  },
  {
    id: 6,
    name: "NaOH",
    description: "Sodium hydroxide",
    ph: 14.0,
    concentration: 1.0,
    image: "/staticimages/NaOH.jpg"
  }
];

// Исправленная функция - принимает строку query
export const getChemicals = async (query?: string): Promise<ChemicalElement[]> => {
  try {
    const url = query ? `${API_BASE}/elements?query=${encodeURIComponent(query)}` : `${API_BASE}/elements`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<{ items: ChemicalElement[] }> = await response.json();
    
    return data.data?.items || [];
  } catch (error) {
    console.warn('API request failed, using mock data:', error);
    
    // Фильтрация mock данных
    if (query) {
      return CHEMICALS_MOCK.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return CHEMICALS_MOCK;
  }
};

// Получить один элемент по ID
export const getChemicalById = async (id: number): Promise<ChemicalElement | null> => {
  try {
    const response = await fetch(`${API_BASE}/elements/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<ChemicalElement> = await response.json();
    return data.data || null;
  } catch (error) {
    console.warn('Failed to fetch element, using mock:', error);
    return CHEMICALS_MOCK.find((el) => el.id === id) || null;
  }
};

// Добавить в корзину
export const addToMixing = async (element_id: number, volume: number = 100): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/mixing/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ element_id, volume }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to add to mixing:', error);
    return false;
  }
};

// Получить содержимое корзины
export const getMixingCart = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/mixing`, {
      credentials: 'include',
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data?.items || [];
  } catch (error) {
    console.warn('Failed to fetch mixing cart:', error);
    return [];
  }
};

// Удалить из корзины
export const removeFromMixing = async (element_id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/mixing/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ element_id }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to remove from mixing:', error);
    return false;
  }
};

// Получить количество товаров в корзине
export const getCartCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE}/mixing/cart-icon`, {
      credentials: 'include',
    });
    
    if (!response.ok) return 0;
    
    const data = await response.json();
    return data.data?.count || 0;
  } catch (error) {
    console.warn('Failed to fetch cart count');
    return 0;
  }
};