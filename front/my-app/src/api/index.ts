// src/api/index.ts (или src/api.ts)

import { Api } from "./Api"; // Ваш сгенерированный файл с классами
import { STATIC_BASE } from '../config/config'; // Если нужно

// Определяем тип данных безопасности
type SecurityData = { token: string };

// 1. Создаем экземпляр API
export const api = new Api<SecurityData>({
  baseURL: "http://localhost:8082/api/v1", // Убедитесь, что порт и путь верные
  
  // 2. Настраиваем securityWorker - он будет добавлять заголовок к КАЖДОМУ запросу через этот api
  securityWorker: (securityData) => {
    if (!securityData?.token) return {};
    return { 
        headers: { 
            Authorization: `Bearer ${securityData.token}` 
        } 
    };
  },
});

// 3. ВАЖНО: Сразу после создания проверяем localStorage и устанавливаем токен
// Это "оживит" api сразу при загрузке страницы, если пользователь уже входил ранее
const savedToken = localStorage.getItem('accessToken'); 
// ПРОВЕРЬТЕ: в консоли браузера (Application -> Local Storage), как именно называется ключ: 'token', 'access_token' или иначе?
// Допустим, он называется 'token'.

if (savedToken) {
    api.setSecurityData({ token: savedToken });
}

// 4. Вспомогательная функция, которую вы будете вызывать при Логине и Логауте
export const setAuthToken = (token: string | null) => {
    if (token) {
        // Сохраняем в API
        api.setSecurityData({ token });
        // Сохраняем в браузере (чтобы не исчез при F5)
        localStorage.setItem('accessToken', token);
    } else {
        // Стираем
        api.setSecurityData({ token: "" });
        localStorage.removeItem('accessToken');
    }
};
