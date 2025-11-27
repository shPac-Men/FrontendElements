// // src/modules/api.ts
// import type { Element, ApiResponse, MixingResponse } from './types';

// const API_BASE = '/api/v1';

// // Mock данные для fallback
// const MOCK_ELEMENTS: Element[] = [
//   {
//     id: 1,
//     name: 'H2O',
//     description: 'Вода',
//     ph: 7,
//     concentration: 1,
//     image: 'http://localhost:9000/staticimages/h2o.jpg',
//   },
//   {
//     id: 2,
//     name: 'NaOH',
//     description: 'Гидроксид натрия',
//     ph: 14,
//     concentration: 1,
//     image: 'http://localhost:9000/staticimages/naoh.jpg',
//   },
//   {
//     id: 3,
//     name: 'HCl',
//     description: 'Соляная кислота',
//     ph: 0,
//     concentration: 1,
//     image: 'http://localhost:9000/staticimages/hcl.jpg',
//   },
// ];

// // Получить все элементы

// // Получить один элемент по ID
// export const getElementById = async (id: number): Promise<Element | null> => {
//   try {
//     const response = await fetch(`${API_BASE}/elements/${id}`, {
//       credentials: 'include',
//     });
//     if (!response.ok) throw new Error('Failed to fetch element');
//     const data: ApiResponse<Element> = await response.json();
//     return data.data || null;
//   } catch (error) {
//     console.warn('Failed to fetch element', error);
//     // Попробуем найти в mock данных
//     return MOCK_ELEMENTS.find((el) => el.id === id) || null;
//   }
// };

// // Добавить в корзину (требует аутентификации)
// export const addToMixing = async (
//   element_id: number,
//   volume: number
// ): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE}/mixing/items`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ element_id, volume }),
//     });
//     return response.ok;
//   } catch (error) {
//     console.error('Failed to add to mixing', error);
//     return false;
//   }
// };

// // Получить содержимое корзины (требует аутентификации)
// export const getMixingCart = async (): Promise<MixingResponse[]> => {
//   try {
//     const response = await fetch(`${API_BASE}/mixing`, {
//       credentials: 'include',
//     });
//     if (!response.ok) throw new Error('Failed to fetch mixing cart');
//     const data: ApiResponse<MixingResponse[]> = await response.json();
//     return data.data || [];
//   } catch (error) {
//     console.warn('Failed to fetch mixing cart', error);
//     return [];
//   }
// };

// // Удалить из корзины (требует аутентификации)
// export const removeFromMixing = async (element_id: number): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE}/mixing/remove`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ element_id }),
//     });
//     return response.ok;
//   } catch (error) {
//     console.error('Failed to remove from mixing', error);
//     return false;
//   }
// };

// // Получить количество товаров в корзине
// export const getCartCount = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE}/mixing/cart-icon`, {
//       credentials: 'include',
//     });
//     if (!response.ok) throw new Error('Failed to fetch cart count');
//     const data: ApiResponse<{ count: number }> = await response.json();
//     return data.data?.count || 0;
//   } catch (error) {
//     console.warn('Failed to fetch cart count', error);
//     return 0;
//   }
// };

// // src/modules/api.ts

// export const getAllElements = async (): Promise<Element[]> => {
//   try {
//     const response = await fetch(`${API_BASE}/elements`, {
//       credentials: 'include',
//     });
//     if (!response.ok) throw new Error('Failed to fetch elements');
    
//     // ← ИЗМЕНИТЕ ЭТУ ЧАСТЬ:
//     const data = await response.json();
    
//     // Ваш API возвращает: { success: true, data: { items: [...], query: "", total: 8 } }
//     // Поэтому берем items из data.data
//     return data.data?.items || MOCK_ELEMENTS;
    
//   } catch (error) {
//     console.warn('Using mock data for elements', error);
//     return MOCK_ELEMENTS;
//   }
// };
