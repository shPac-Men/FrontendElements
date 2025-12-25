import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllOrders, updateOrderStatus } from '../../store/ordersSlice';
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';
import { api } from '../../api';
import './AdminOrdersPage.css';

export const AdminOrdersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);
  
  // Функция для получения сегодняшней даты в формате YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>(getTodayDate());
  const [creatorFilter, setCreatorFilter] = useState<string>('');
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Проверка прав модератора
  useEffect(() => {
    if (!user || !user.is_moderator) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  // Функция для загрузки данных с фильтрами
  const loadOrders = useCallback(() => {
    const filters: any = {};
    if (statusFilter) filters.status = statusFilter;
    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;
    
    dispatch(fetchAllOrders(filters));
  }, [statusFilter, dateFrom, dateTo, dispatch]);

  // Первоначальная загрузка и short polling
  useEffect(() => {
    loadOrders();
    
    pollingIntervalRef.current = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [loadOrders]);

  // Фильтрация по создателю на фронтенде
  const filteredList = list.filter((order: any) => {
    if (!creatorFilter) return true;
    return order.creator_login?.toLowerCase().includes(creatorFilter.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDateInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Готов';
      case 'draft': return 'Черновик';
      case 'pending': return 'В работе';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // Если статус "completed", вызываем CompleteMixed (который запускает Python-сервис)
    if (newStatus === 'completed') {
      try {
        const response = await api.admin.mixedCompleteUpdate(orderId, {});
        console.log('Заявка завершена:', response);
        alert('Заявка завершена. pH будет рассчитан автоматически.');
        // После успешного завершения перезагружаем список
        loadOrders();
      } catch (error: any) {
        console.error('Ошибка завершения заявки:', error);
        const errorMessage = error?.response?.data?.error || 
                           error?.response?.data?.message || 
                           error?.message || 
                           'Ошибка при завершении заявки';
        console.error('Детали ошибки:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: errorMessage
        });
        alert(`Ошибка при завершении заявки: ${errorMessage}`);
        return;
      }
    } else {
      // Для других статусов просто обновляем статус
      try {
        await dispatch(updateOrderStatus({ orderId, status: newStatus }));
        loadOrders();
      } catch (error: any) {
        console.error('Ошибка обновления статуса:', error);
        alert(error?.message || 'Ошибка при обновлении статуса');
      }
    }
  };

  // Фильтры применяются автоматически через useEffect

  if (!user || !user.is_moderator) {
    return null;
  }

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header>
          <h1>
            <Link to={ROUTES.HOME}>
              <img src={`${STATIC_BASE}/image.svg`} alt="home" />
            </Link>
            <span className="page-title">Управление заявками (Модератор)</span>
          </h1>
        </header>
      </section>

      <main className="orders-container">
        {/* Фильтры */}
        <div className="filters-panel">
          <div className="filter-group">
            <label>Статус:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все</option>
              <option value="draft">Черновик</option>
              <option value="completed">Готов</option>
              <option value="rejected">Отклонен</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Дата от:</label>
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Дата до:</label>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Создатель:</label>
            <input 
              type="text" 
              placeholder="Поиск по логину..."
              value={creatorFilter} 
              onChange={(e) => setCreatorFilter(e.target.value)}
            />
          </div>
        </div>

        {loading && list.length === 0 ? (
          <div className="loading">Загрузка данных...</div>
        ) : filteredList.length === 0 ? (
          <div className="no-results">
            <p>Заявки не найдены.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Дата создания</th>
                  <th>Создатель</th>
                  <th>Статус</th>
                  <th>Элементов</th>
                  <th>Объем (мл)</th>
                  <th>pH</th>
                  <th>Конц. (%)</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((order: any) => (
                  <tr key={order.id} className="order-row">
                    <td className="col-date">
                      <div className="date-primary">{formatDate(order.date_create)}</div>
                    </td>
                    <td>{order.creator_login || '—'}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="col-center">{order.items_count ?? 0}</td>
                    <td className="col-center">{order.total_volume ?? 0}</td>
                    <td className="col-center font-bold">{(order.ph ?? 0).toFixed(2)}</td>
                    <td className="col-center font-bold">{(order.concentration ?? 0).toFixed(2)}%</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-status btn-draft"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order.id, 'draft');
                          }}
                          disabled={order.status === 'draft'}
                        >
                          Черновик
                        </button>
                        <button
                          className="btn-status btn-completed"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order.id, 'completed');
                          }}
                          disabled={order.status === 'completed'}
                        >
                          Готов
                        </button>
                        <Link 
                          to={`/orders/${order.id}`} 
                          className="btn-small" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          Открыть
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

