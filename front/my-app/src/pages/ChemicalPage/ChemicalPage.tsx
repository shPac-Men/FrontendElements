

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import { getChemicals, addToMixing, getCartCount } from '../../modules/chemistryApi';
import './ChemicalPage.css';

export const ChemicalPage: FC = () => {
  const [chemicals, setChemicals] = useState<ChemicalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const loadChemicals = async (query?: string) => {
    setLoading(true);
    try {
      const elements = await getChemicals(query);
      setChemicals(elements);
    } catch (error) {
      console.error('Error loading chemicals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const count = await getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  useEffect(() => {
    loadChemicals();
    loadCartCount();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadChemicals(searchQuery);
  };

  const handleAddToMixing = async (id: number) => {
    try {
      const success = await addToMixing(id, 100); // 100ml по умолчанию
      if (success) {
        setCartCount(prev => prev + 1);
        alert('Реактив добавлен в корзину');
      } else {
        alert('Ошибка при добавлении в корзину');
      }
    } catch (error) {
      console.error('Error adding to mixing:', error);
      alert('Ошибка при добавлении в корзину');
    }
  };

  return (
    <div className="chemistry-page">
      {/* Hero секция с картинкой */}
      <section className="hero">
        <header>
          <h1>
            <Link to="/chemicals">
              <img src="/staticimages/image.svg" alt="home" />
            </Link>
          </h1>
        </header>
      </section>

      {/* Поиск и корзина в одной строке */}
      <div className="search-section">
        <Link to="/mixing" className="cart-link">
          <img src="/staticimages/breaker.svg" alt="cart" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            name="query" 
            placeholder="Введите запрос" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Найти</button>
        </form>
      </div>

      {/* Основная часть (белая) */}
      <main>
        {/* Карточки */}
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : chemicals.length === 0 ? (
            <div className="no-results">Реактивы не найдены</div>
          ) : (
            chemicals.map((chemical) => (
              <div key={chemical.id} className="card">
                <img 
                  src={chemical.image} 
                  alt={chemical.name} 
                  className="card-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/staticimages/default_element.png';
                  }}
                />
                <h3>{chemical.name}</h3>
                <p><strong>Концентрация:</strong> {chemical.concentration}</p>
                <p><strong>pH:</strong> {chemical.ph}</p>
                <Link to={`/element/${chemical.id}`} className="btn">Подробнее</Link>
                <button 
                  type="button" 
                  className="btn btn-cart"
                  onClick={() => handleAddToMixing(chemical.id)}
                >
                  В корзину
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};