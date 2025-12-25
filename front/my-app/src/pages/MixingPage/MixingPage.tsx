import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMixingCart, removeFromMixing } from '../../modules/chemistryApi';
import { ROUTES } from '../../Routes';
import './MixingPage.css';
import { STATIC_BASE, API_BASE } from '../../config/config';
import { useAppSelector } from '../../store/hooks';
import { api } from '../../api';

// Единый интерфейс для элемента в списке, будь то из корзины или из черновика
interface DisplayItem {
  id: number;
  volume: number;
  name: string;
  ph: number;
  concentration: number;
  image: string;
}

export const MixingPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedWater, setAddedWater] = useState(100);
  const [result, setResult] = useState('');
  // Удалено состояние isCreatingOrder
  const [draftId, setDraftId] = useState<number | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  // Функция для загрузки данных (черновика или корзины)
  const loadDraftOrCart = async () => {
    setLoading(true);
    try {
      // Если в URL есть ID, загружаем конкретный черновик
      if (id) {
        const draftIdNum = parseInt(id);
        if (!isNaN(draftIdNum)) {
          setDraftId(draftIdNum);
          
          // Загружаем детали этого черновика
          const detailResponse = await api.mixed.getMixed2(draftIdNum);
          const draftDetails = detailResponse.data;

          // Нормализуем данные из заказа в наш формат DisplayItem
          const normalizedItems = (draftDetails.items || []).map((item: any) => ({
            id: item.element_id,
            volume: item.volume,
            name: item.title,
            ph: item.ph,
            concentration: item.concentration,
            image: item.image,
          }));

          setItems(normalizedItems);
          setAddedWater(draftDetails.added_water || 100);
          setLoading(false);
          return;
        }
      }

      // Если ID нет в URL, используем старую логику
      // 1. Ищем существующий черновик
      const draftResponse = await api.mixed.getMixed({ status: 'draft', limit: 1 });
      const drafts = draftResponse.data;

      if (drafts && drafts.length > 0) {
        // --- РЕЖИМ РЕДАКТИРОВАНИЯ ЧЕРНОВИКА ---
        const currentDraft = drafts[0];
        setDraftId(currentDraft.id ?? null);
        
        // Перенаправляем на URL с ID черновика
        if (currentDraft.id) {
          navigate(`/mixing/${currentDraft.id}`, { replace: true });
          setLoading(false);
          return; // После навигации компонент перемонтируется с новым id
        }

        // Загружаем детали этого черновика (если navigate не произошел)
        const detailResponse = await api.mixed.getMixed2(currentDraft.id!);
        const draftDetails = detailResponse.data;

        // Нормализуем данные из заказа в наш формат DisplayItem
        const normalizedItems = (draftDetails.items || []).map((item: any) => ({
          id: item.element_id,
          volume: item.volume,
          name: item.title,
          ph: item.ph,
          concentration: item.concentration,
          image: item.image,
        }));

        setItems(normalizedItems);
        setAddedWater(draftDetails.added_water || 100);
        
      } else {
        // --- РЕЖИМ ОБЫЧНОЙ КОРЗИНЫ ---
        // Корзина и черновик - это одно и то же, поэтому если нет черновика, корзина тоже пустая
        setDraftId(null);
        const cartResponse = await api.mixing.mixingList();
        const cart = cartResponse.data as any;
        
        if (cart?.cart_id && cart?.items && cart.items.length > 0) {
          // Если есть корзина с элементами, используем её как черновик
          setDraftId(cart.cart_id);
          const normalizedItems = (cart.items || []).map((item: any) => ({
            id: item.id,
            volume: item.volume,
            name: item.title,
            ph: item.ph,
            concentration: item.concentration,
            image: item.image,
          }));
          setItems(normalizedItems);
        } else {
          // Корзина пустая
          const cartItems = await getMixingCart();
          const normalizedItems = (cartItems || []).map((item: any) => ({
            id: item.element.id,
            volume: item.volume,
            name: item.element.name,
            ph: item.element.ph,
            concentration: item.element.concentration,
            image: item.element.image,
          }));
          setItems(normalizedItems);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки черновика или корзины:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
        navigate(ROUTES.LOGIN);
        return;
    }
    loadDraftOrCart();
  }, [user, id]);

  // Функция handleCreateOrder удалена полностью

  const handleRemoveItem = async (elementId: number) => {
    if (!confirm('Удалить этот элемент?')) return;

    if (draftId) {
      // пример: await api.mixed.deleteItem(draftId, elementId)
      await api.mixed.itemsDelete(draftId, {
                element_id: elementId,
            });// <- заменить на реальный метод
      await loadDraftOrCart();
      return;
    }

    const success = await removeFromMixing(elementId);
    if (success) await loadDraftOrCart();
    else alert('Ошибка при удалении');
  };

  // Отправка заявки на обработку (рассчитать pH)
  const handleCalculate = async () => {
    if (items.length === 0) {
      alert('Добавьте элементы в корзину');
      return;
    }

    try {
      // Если есть черновик, используем его ID
      let targetDraftId = draftId;
      
      // Если черновика нет, но есть элементы в корзине, нужно получить ID корзины
      if (!targetDraftId) {
        // Получаем корзину через API
        const cartResponse = await api.mixing.mixingList();
        const cart = cartResponse.data as any;
        if (cart?.cart_id) {
          targetDraftId = cart.cart_id;
        } else {
          alert('Не удалось найти черновик. Добавьте элементы в корзину.');
          return;
        }
      }

      // Отправляем на обработку через новый эндпоинт
      const response = await fetch(`${API_BASE}/mixing/${targetDraftId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          added_water: addedWater
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при отправке заявки');
      }

      const result = await response.json();
      alert('Заявка отправлена на обработку. pH будет рассчитан автоматически.');
      
      // Очищаем страницу, чтобы пользователь мог создать новую заявку
      setItems([]);
      setDraftId(null);
      setResult('');
      await loadDraftOrCart();
    } catch (error: any) {
      console.error('Ошибка отправки заявки:', error);
      alert(error?.message || 'Ошибка при отправке заявки');
    }
  };

  const handleAddWater = async () => {
    // Обновляем добавленную воду в черновике, если он есть
    if (draftId) {
      try {
        await api.admin.mixedUpdate(draftId, {
          added_water: addedWater
        });
        alert('Добавленная вода обновлена');
      } catch (error: any) {
        console.error('Ошибка обновления воды:', error);
        // Игнорируем ошибку, так как это может быть просто корзина
      }
    }
  };

  // Очистка всех элементов из черновика/корзины
  const handleClearCart = async () => {
    if (items.length === 0) {
      alert('Корзина уже пуста');
      return;
    }

    if (!confirm('Удалить все элементы из корзины?')) {
      return;
    }

    try {
      if (draftId) {
        // Если есть черновик, удаляем все элементы через API
        const deletePromises = items.map(item => 
          api.mixed.itemsDelete(draftId, { element_id: item.id })
        );
        await Promise.all(deletePromises);
      } else {
        // Если черновика нет, удаляем элементы из корзины
        const deletePromises = items.map(item => removeFromMixing(item.id));
        await Promise.all(deletePromises);
      }

      // Обновляем список после удаления
      await loadDraftOrCart();
      alert('Корзина очищена');
    } catch (error: any) {
      console.error('Ошибка очистки корзины:', error);
      alert('Ошибка при очистке корзины');
    }
  };

  return (
    <div className="mixing-page">
      <header>
        <Link to={ROUTES.HOME} className="home-link">
          <img src={`${STATIC_BASE}/image.svg`} alt="На главную" />
        </Link>
        <h2>{draftId ? `Редактирование расчета` : 'Новый расчет (Корзина)'}</h2>
      </header>

      <div className="temperature-section">
        <div className="input-group">
            <label>Добавленная вода (мл):</label>
            <input type="number" value={addedWater} onChange={(e) => setAddedWater(parseInt(e.target.value) || 0)} />
            <button type="button" className="btn-temperature" onClick={handleAddWater}>Применить</button>
        </div>
        <div className="result-display">
            <input type="text" readOnly value={result} placeholder="Результат расчета pH" />
        </div>
        
        {/* Блок с кнопками */}
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn calculate-btn" onClick={handleCalculate} disabled={items.length === 0}>Рассчитать pH</button>
            <button type="button" className="btn" onClick={handleClearCart} disabled={items.length === 0}>Очистить</button>
        </div>
      </div>

      <main>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : items.length === 0 ? (
            <div className="empty-cart">
              <p>Здесь пока пусто</p>
              <Link to={ROUTES.CHEMICALS} className="btn">Добавить элементы</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="card">
                <div className="card-content">
                  <div className="card-column">
                    <img src={item.image} alt={item.name} className="card-img" onError={(e) => { e.currentTarget.src = `${STATIC_BASE}/default_element.png`; }}/>
                  </div>
                  <div className="card-column">
                    <h3>{item.name}</h3>
                    <div className="info-item"><strong>pH:</strong> {item.ph}</div>
                    <div className="info-item"><strong>Конц.:</strong> {item.concentration}%</div>
                  </div>
                  <div className="card-column">
                    <div className="mass-input">
                      <label>Объем (мл):</label>
                      <input type="number" value={item.volume} disabled />
                    </div>
                    <button type="button" className="btn btn-remove" onClick={() => handleRemoveItem(item.id)}>Удалить</button>
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
