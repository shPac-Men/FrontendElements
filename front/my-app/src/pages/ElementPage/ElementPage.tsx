// src/pages/ElementsPage/ElementsPage.tsx
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { getAllElements } from '../../modules/api';
import type { Element } from '../../modules/types';
import './ElementPage.css';

const CART_ICON = 'http://localhost:9000/staticimages/breaker.svg';
const DEFAULT_IMAGE = 'https://via.placeholder.com/180?text=No+Image';

export const ElementsPage: FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchElements = async () => {
      setLoading(true);
      const data = await getAllElements();
      setElements(data);
      setLoading(false);
    };

    fetchElements();
  }, []);

  const filteredElements = elements.filter(
    (el) =>
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="elements-page"><p>Загрузка...</p></div>;
  }

  return (
    <div className="elements-page-wrapper">
      {/* Search section с корзиной */}
      <div className="search-section">
        <Link to="/mixing" className="cart-link">
          <img src={CART_ICON} alt="cart" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Введите запрос"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Найти</button>
        </form>
      </div>

      {/* Main content */}
      <main>
        <div className="cards-container">
          {filteredElements.length > 0 ? (
            filteredElements.map((element) => (
              <div key={element.id} className="card">
                <img
                  src={element.image || DEFAULT_IMAGE}
                  alt={element.name}
                  className="card-img"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                />
                <h3>{element.name}</h3>
                <p>
                  <strong>Концентрация:</strong> {element.concentration}
                </p>
                <p>
                  <strong>pH:</strong> {element.ph}
                </p>
                <Link to={`/elements/${element.id}`} className="btn">
                  Подробнее
                </Link>
                <button
                  type="button"
                  className="btn btn-cart"
                  onClick={() => {
                    setCartCount(cartCount + 1);
                    // Здесь будет вызов API
                  }}
                >
                  В корзину
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">Реактивы не найдены</p>
          )}
        </div>
      </main>
    </div>
  );
};
