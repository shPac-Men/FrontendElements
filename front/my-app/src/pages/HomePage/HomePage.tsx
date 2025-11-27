// src/pages/HomePage/HomePage.tsx
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './HomePage.css';

export const HomePage: FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Chemistry Lab</h1>
          <p>Расчет и планирование химических реакций</p>
          <Link to={ROUTES.ELEMENTS} className="btn btn-primary btn-large">
            Начать
          </Link>
        </div>
      </section>

      <section className="info">
        <div className="info-content">
          <h2>Добро пожаловать</h2>
          <p>
            Наша платформа предназначена для расчета и планирования химических
            реакций. Выберите нужные вам реактивы и получите расчеты для вашего
            эксперимента.
          </p>
        </div>
      </section>
    </div>
  );
};
