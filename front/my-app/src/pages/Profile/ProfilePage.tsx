// src/pages/Profile/ProfilePage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile } from '../../store/authSlice';
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';
//import './ProfilePage.css'; // Можно отдельный css или общий

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    try {
      await dispatch(updateProfile({ password })).unwrap();
      setMsg('Пароль успешно обновлен');
      setPassword('');
    } catch (e) {
      setMsg('Ошибка обновления');
    }
  };

  if (!user) return <div className="loading">Вы не авторизованы</div>;

  return (
    <div className="chemistry-page">
      <header className="hero">
        <h1>
          <Link to={ROUTES.HOME}>
            <img src={`${STATIC_BASE}/image.svg`} alt="home" />
          </Link>
          <span style={{ marginLeft: '1rem', color: 'white' }}>Личный кабинет</span>
        </h1>
      </header>

      <main>
        <div className="card profile-card" style={{ maxWidth: '500px', margin: '2rem auto', flexDirection: 'column' }}>
            <div className="profile-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <img src={`${STATIC_BASE}/default_element.png`} alt="avatar" style={{ width: 100, borderRadius: '50%' }} />
                <h2>{user.login}</h2>
                <p className="role-badge">Роль: {user.role || 'Пользователь'}</p>
            </div>

            <form onSubmit={handleUpdate} style={{ width: '100%' }}>
                <h3>Смена пароля</h3>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="Новый пароль" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-input"
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                    />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Сохранить новый пароль</button>
            </form>
            {msg && <p style={{ textAlign: 'center', marginTop: '1rem', color: 'green' }}>{msg}</p>}
        </div>
      </main>
    </div>
  );
};
