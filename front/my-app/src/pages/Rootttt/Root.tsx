// src/pages/Root/Root.tsx
import type { FC } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES } from '../../Routes';
import './Root.css';

export const Root: FC = () => {
  return (
    <div className="root-layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to={ROUTES.HOME} className="nav-logo">
            Chemistry Lab
          </Link>
          <div className="nav-links">
            <Link to={ROUTES.HOME}>Главная</Link>
            <Link to={ROUTES.ELEMENTS}>Реактивы</Link>
            <Link to={ROUTES.MIXING}>Расчет</Link>
          </div>
        </div>
      </nav>

      <Breadcrumbs />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Chemistry Lab. Все права защищены.</p>
      </footer>
    </div>
  );
};
