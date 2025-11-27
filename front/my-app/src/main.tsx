// main.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Убедитесь, что эта строка есть

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom';

import App from './App.tsx';
import StartPage from './pages/StartPage.tsx';
// 1. Импортируем новую страницу ITunes
import ITunesPage from './pages/ITunesPage/ITunesPage.tsx';
import './index.css';

// Корневой компонент-обертка
function Root() {
  return (
    <>
      {/* Навигация */}
      <ul>
        <li>
          <Link to="/">Главная (App)</Link>
        </li>
        <li>
          <Link to="/start">Start Page</Link>
        </li>
        {/* 2. Добавляем ссылку на страницу iTunes */}
        <li>
          <Link to="/itunes">iTunes Search</Link>
        </li>
      </ul>
      <hr />
      {/* Место для отображения дочерних страниц */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

// Настраиваем роутер
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'start',
        element: <StartPage />,
      },
      // 3. Добавляем новый маршрут для ITunesPage
      {
        path: 'itunes',
        element: <ITunesPage />,
      },
    ],
  },
]);

// Рендерим приложение
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
