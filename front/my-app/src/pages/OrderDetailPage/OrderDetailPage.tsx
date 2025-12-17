import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrderDetail } from '../../store/ordersSlice';
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetail(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!currentOrder) return <div className="error">Заявка не найдена</div>;

  return (
    <div className="chemistry-page">
      <header className="hero">
        <h1>
            <Link to={ROUTES.ORDERS}>
              <img src={`${STATIC_BASE}/image.svg`} alt="back" width="30" />
            </Link>
            <span style={{ marginLeft: '1rem' }}>Заявка #{currentOrder.id}</span>
        </h1>
      </header>

      <main>
        <div className="card" style={{ flexDirection: 'column', alignItems: 'flex-start', maxWidth: '600px', margin: '2rem auto' }}>
          <h2>Статус: {currentOrder.status}</h2>
          <p>Дата создания: {new Date(currentOrder.created_at || Date.now()).toLocaleDateString()}</p>
          
          <h3>Состав:</h3>
          {currentOrder.items && currentOrder.items.length > 0 ? (
            <ul>
              {currentOrder.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.element?.name || `Элемент #${item.element_id}`} — {item.volume} мл
                </li>
              ))}
            </ul>
          ) : (
            <p>Список пуст</p>
          )}
        </div>
      </main>
    </div>
  );
};
