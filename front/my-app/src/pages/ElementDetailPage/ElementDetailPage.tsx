// src/pages/ElementDetailPage/ElementDetailPage.tsx
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElementById } from '../../modules/api';
import type { Element } from '../../modules/types';
import './ElementDetailPage.css';

const LOGO = 'http://localhost:9000/staticimages/image.svg';

export const ElementDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [element, setElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElement = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getElementById(Number(id));
      setElement(data);
      setLoading(false);
    };

    fetchElement();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!element) {
    return (
      <div className="detail-page">
        <p>Реактив не найден</p>
        <button onClick={() => navigate('/elements')}>Вернуться</button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="header">
        <a href="#" className="home-button" onClick={() => navigate('/elements')}>
          <img src={LOGO} alt="На главную" width="40" height="40" />
        </a>
        <h1>Информация о реактиве</h1>
      </div>

      <div className="card">
        {/* Химическая формула (Name) */}
        <div className="formula">{element.name}</div>

        {/* Свойства */}
        <div className="property">
          <div className="property-title">Концентрация</div>
          <div className="property-value">{element.concentration}</div>
        </div>

        <div className="property">
          <div className="property-title">pH</div>
          <div className="property-value">{element.ph}</div>
        </div>

        {element.description && (
          <div className="order-info">
            <div className="order-title">{element.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};
