import type { FC } from "react";
import { Link } from "react-router-dom";
import './HomePage.css';
import { ROUTES } from '../../Routes';  // ← Добавьте импорт

export const HomePage: FC = () => {
  return (
    <div className="home-page">
      {/* Hero секция с картинкой */}
      <section className="hero">
        <header>
          <h1>
            <Link to="/">
              <img src="http://localhost:9000/staticimages/image.svg" alt="home" />
            </Link>
          </h1>
        </header>
      </section>

      <main>
        <div className="welcome-section">
          <h2>Добро пожаловать в химическую лабораторию</h2>
          <p>Исследуйте химические реактивы и создавайте смеси</p>
          <Link to={ROUTES.CHEMICALS} className="btn btn-primary">
            Перейти к реактивам
          </Link>
        </div>
      </main>
    </div>
  );
};