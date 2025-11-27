import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { getMixingCart, removeFromMixing } from '../../modules/chemistryApi';
import './MixingPage.css';

interface MixingItem {
  id: number;
  element_id: number;
  volume: number;
  element: {
    id: number;
    name: string;
    description: string;
    ph: number;
    concentration: number;
    image: string;
  };
}

export const MixingPage: FC = () => {
  const [cartItems, setCartItems] = useState<MixingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedWater, setAddedWater] = useState(100);
  const [result, setResult] = useState('');

  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getMixingCart();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleAddWater = () => {
    alert(`Добавленная вода применена: ${addedWater} мл`);
    setResult('');
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Показываем анимацию загрузки
    const btn = document.getElementById('createRequestBtn') as HTMLButtonElement;
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Расчет...';
    }

    // Имитация расчета
    setTimeout(() => {
      const calculatedPH = (7.0).toFixed(1); // Пример расчета
      setResult(`pH: ${calculatedPH} с добавленной водой`);
      
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Рассчитать';
      }
    }, 2000);
  };

  const handleRemoveFromMixing = async (element_id: number) => {
    if (!confirm('Удалить этот элемент из корзины?')) {
      return;
    }

    try {
      const success = await removeFromMixing(element_id);
      if (success) {
        // Обновляем корзину
        loadCart();
        alert('Элемент удален из корзины');
      } else {
        alert('Ошибка при удалении из корзины');
      }
    } catch (error) {
      console.error('Error removing from mixing:', error);
      alert('Ошибка при удалении из корзины');
    }
  };

  const handleVolumeChange = (id: number, newVolume: number) => {
    // TODO: реализовать обновление объема через API
    console.log(`Change volume for item ${id} to ${newVolume}ml`);
  };

  return (
    <div className="mixing-page">
      <header>
        <Link to="/chemicals" className="home-link">
          <img src="/staticimages/image.svg" alt="На главную" />
        </Link>
      </header>

      {/* Поле для ввода добавленной воды с кнопкой заявки */}
      <div className="temperature-section">
        <form className="temperature-form" id="temperatureForm">
          <div className="input-group">
            <label htmlFor="added_water">Добавленная вода (мл):</label>
            <input 
              type="number" 
              id="added_water" 
              name="added_water" 
              placeholder="100" 
              step="1" 
              min="0" 
              value={addedWater}
              onChange={(e) => setAddedWater(parseInt(e.target.value) || 100)}
            />
            <button 
              type="button" 
              className="btn-temperature"
              onClick={handleAddWater}
            >
              Добавить
            </button>
          </div>
        </form>

        {/* Результат между "Добавить" и "Рассчитать" */}
        <div className="result-display">
          <input 
            type="text" 
            placeholder="Результат" 
            readOnly
            value={result}
            id="resultField"
          />
        </div>

        {/* Кнопка расчета */}
        <form onSubmit={handleCalculate} id="requestForm">
          <input 
            type="hidden" 
            name="added_water" 
            id="hiddenAddedWater" 
            value={addedWater} 
          />
          <button 
            type="submit" 
            className="btn calculate-btn" 
            id="createRequestBtn" 
            disabled={cartItems.length === 0}
          >
            Рассчитать
          </button>
        </form>
      </div>

      <main>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка корзины...</div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Корзина пуста</p>
              <Link to="/chemicals" className="btn">Добавить элементы</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="card">
                <div className="card-content">
                  <div className="card-column">
                    <img 
                      src={item.element.image} 
                      alt={item.element.name} 
                      className="card-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/staticimages/default_element.png';
                      }}
                    />
                  </div>
                  <div className="card-column">
                    <h3>{item.element.name}</h3>
                    <div className="info-item">
                      <strong>pH:</strong> {item.element.ph}
                    </div>
                    <div className="info-item">
                      <strong>Концентрация:</strong> {item.element.concentration}
                    </div>
                    <div className="info-item">
                      <strong>Температура:</strong> 25°C
                    </div>
                  </div>
                  <div className="card-column">
                    <div className="mass-input">
                      <label htmlFor={`mass-${item.element.id}`}>Объем (мл):</label>
                      <input 
                        type="number" 
                        id={`mass-${item.element.id}`} 
                        className="mass-field" 
                        placeholder={item.volume.toString()} 
                        step="0.1" 
                        min="0" 
                        value={item.volume}
                        onChange={(e) => handleVolumeChange(item.element.id, parseFloat(e.target.value) || item.volume)}
                      />
                    </div>
                    {/* Кнопка удаления из корзины */}
                    <button 
                      type="button" 
                      className="btn btn-remove"
                      onClick={() => handleRemoveFromMixing(item.element.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};