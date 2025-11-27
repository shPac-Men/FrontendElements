// src/pages/MixingPage/MixingPage.tsx
import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './MixingPage.css';

const LOGO = 'http://localhost:9000/staticimages/image.svg';
const DEFAULT_IMAGE = 'https://via.placeholder.com/120?text=No+Image';

interface CartItem {
  id: number;
  name: string;
  ph: number;
  concentration: number;
  image: string;
  volume: number;
}

interface MixingPageProps {
  cartItems?: CartItem[];
}

export const MixingPage: FC<MixingPageProps> = ({ cartItems = [] }) => {
  const navigate = useNavigate();
  const [addedWater, setAddedWater] = useState(100);
  const [calculatedPH, setCalculatedPH] = useState<number | null>(null);
  const [items, setItems] = useState(cartItems);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAddWater = () => {
    // Расчет pH
    const avgPH = items.length > 0 
      ? items.reduce((sum, item) => sum + item.ph, 0) / items.length 
      : 7;
    setCalculatedPH(avgPH);
  };

  const handleRemoveItem = (itemId: number) => {
    if (confirm('Удалить этот элемент из корзины?')) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Имитация отправки запроса
      alert(`Рассчитано с добавленной водой: ${addedWater} мл`);
      setIsCalculating(false);
    }, 1000);
  };

  const handleVolumeChange = (itemId: number, newVolume: number) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, volume: newVolume } : item
      )
    );
  };

  return (
    <div className="mixing-page">
      <header>
        <a
          href="#"
          className="home-link"
          onClick={() => navigate('/elements')}
        >
          <img src={LOGO} alt="На главную" />
        </a>
      </header>

      {/* Секция температуры */}
      <div className="temperature-section">
        <form className="temperature-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label htmlFor="added_water">Добавленная вода (мл):</label>
            <input
              type="number"
              id="added_water"
              placeholder="100"
              step="1"
              min="0"
              value={addedWater}
              onChange={(e) => setAddedWater(Number(e.target.value))}
            />
            <button type="button" className="btn-temperature" onClick={handleAddWater}>
              Добавить
            </button>
          </div>
        </form>

        {/* Результат */}
        <div className="result-display">
          <input
            type="text"
            placeholder="Результат"
            readOnly
            value={
              calculatedPH
                ? `pH: ${calculatedPH.toFixed(2)} с добавленной водой`
                : ''
            }
            id="resultField"
          />
        </div>

        {/* Кнопка расчета */}
        <button
          type="button"
          className="btn calculate-btn"
          onClick={handleCalculate}
          disabled={items.length === 0 || isCalculating}
        >
          {isCalculating ? 'Расчет...' : 'Рассчитать'}
        </button>
      </div>

      {/* Main content */}
      <main>
        <div className="cards-container">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="card">
                <div className="card-content">
                  <div className="card-column">
                    <img
                      src={item.image || DEFAULT_IMAGE}
                      alt={item.name}
                      className="card-img"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="card-column">
                    <h3>{item.name}</h3>
                    <div className="info-item">
                      <strong>pH:</strong> {item.ph}
                    </div>
                    <div className="info-item">
                      <strong>Концентрация:</strong> {item.concentration}
                    </div>
                    <div className="info-item">
                      <strong>Температура:</strong> 25°C
                    </div>
                  </div>
                  <div className="card-column">
                    <div className="mass-input">
                      <label htmlFor={`mass-${item.id}`}>Объем (мл):</label>
                      <input
                        type="number"
                        id={`mass-${item.id}`}
                        className="mass-field"
                        placeholder={String(item.volume)}
                        step="0.1"
                        min="0"
                        value={item.volume}
                        onChange={(e) =>
                          handleVolumeChange(item.id, Number(e.target.value))
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-remove"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <p>Корзина пуста</p>
              <a href="#" onClick={() => navigate('/elements')} className="btn">
                Добавить элементы
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
