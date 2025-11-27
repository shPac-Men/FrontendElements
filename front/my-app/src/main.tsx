// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { HomePage } from './pages/HomePage/HomePage';
import { ChemicalPage } from './pages/ChemicalPage/ChemicalPage';
import { ChemicalDetailPage } from './pages/ChemicalDetailPage/ChemicalDetailPage';
import { MixingPage } from './pages/MixingPage/MixingPage';
import { Navbar } from './components/Navbar/Navbar';
import { Breadcrumbs } from './components/BreadCrumbs/BreadCrumbs';
import { ROUTES } from './Routes';
import './index.css';

// Layout компонент с navbar и breadcrumbs
const RootLayout = () => (
  <div className="app-layout">
    <Navbar />
    <Breadcrumbs />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.CHEMICALS,
        element: <ChemicalPage />,
      },
      {
        path: ROUTES.ELEMENT_DETAIL,
        element: <ChemicalDetailPage />,
      },
      {
        path: ROUTES.MIXING,
        element: <MixingPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);