import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChemicalById } from '../../modules/chemistryApi';
import type { ChemicalElement } from '../../types/chemistry';
import './ChemicalDetailPage.css';

export const ChemicalDetailPage: FC = () => {
  const [chemical, setChemical] = useState<ChemicalElement | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const loadChemical = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const element = await getChemicalById(parseInt(id));
        setChemical(element);
      } catch (error) {
        console.error('Error loading chemical:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChemical();
  }, [id]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!chemical) {
    return (
      <div className="error-page">
        <h2>Реактив не найден</h2>
        <Link to="/chemicals" className="btn">Вернуться к списку</Link>
      </div>
    );
  }

  return (
    <div className="element-page">
      <div className="header">
        <Link to="/chemicals" className="home-button">
          <img src="/staticimages/image.svg" alt="На главную" width="40" height="40" />
        </Link>
        <h1>Информация о реактиве</h1>
      </div>

      <div className="card">
        {/* Химическая формула (Name) */}
        <div className="formula">{chemical.name}</div>

        {/* Свойства */}
        <div className="property">
          <div className="property-title">Концентрация</div>
          <div className="property-value">{chemical.concentration}</div>
        </div>

        <div className="property">
          <div className="property-title">pH</div>
          <div className="property-value">{chemical.ph}</div>
        </div>
      </div>
    </div>
  );
};