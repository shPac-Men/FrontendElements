import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import { HomePage } from './pages/HomePage/HomePage';
import { ChemicalPage } from './pages/ChemicalPage/ChemicalPage';
import { ChemicalDetailPage } from './pages/ChemicalDetailPage/ChemicalDetailPage';
import { MixingPage } from './pages/MixingPage/MixingPage';

// --- ИМПОРТИРУЕМ НОВЫЕ СТРАНИЦЫ ---
import { LoginPage } from './pages/Auth/LoginPage'; // Убедись, что путь правильный!
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { OrdersPage } from './pages/Orders/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage/OrderDetailPage';
// ----------------------------------

import { Navbar } from './components/Navbar/Navbar';
import { Breadcrumbs } from './components/BreadCrumbs/BreadCrumbs';
import { ROUTES } from './Routes';
import { initFromLocalStorage, loadProfile } from "./store/authSlice";
import './index.css';

const RootLayout = () => (
  <div className="app-layout">
    <Navbar />
    <Breadcrumbs />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

store.dispatch(initFromLocalStorage());
store.dispatch(loadProfile());

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: ROUTES.HOME, element: <HomePage /> }, // Лучше заменить на { index: true, element: <HomePage /> }
        { path: ROUTES.CHEMICALS, element: <ChemicalPage /> },
        { path: ROUTES.ELEMENT_DETAIL, element: <ChemicalDetailPage /> },
        { path: ROUTES.MIXING, element: <MixingPage /> },

        // --- ДОБАВЛЯЕМ НОВЫЕ РОУТЫ СЮДА ---
        { path: ROUTES.LOGIN, element: <LoginPage /> },
        { path: ROUTES.REGISTER, element: <RegisterPage /> },
        { path: ROUTES.PROFILE, element: <ProfilePage /> },
        { path: ROUTES.ORDERS, element: <OrdersPage /> },
        { path: ROUTES.ORDER_DETAIL, element: <OrderDetailPage /> },
        
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
