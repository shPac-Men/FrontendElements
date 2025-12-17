// src/pages/Auth/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { register } from "../../store/authSlice";
import { ROUTES } from "../../Routes";
import { STATIC_BASE } from "../../config/config";
//import "./AuthPage.css";

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", password: "" });
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    
    if (form.password.length < 6) {
        setLocalError("Пароль должен быть не менее 6 символов");
        return;
    }

    try {
      await dispatch(register(form)).unwrap();
      alert("Регистрация успешна! Теперь войдите.");
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setLocalError("Ошибка регистрации (возможно, логин занят)");
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <Link to={ROUTES.HOME} className="home-link">
            <img src={`${STATIC_BASE}/image.svg`} alt="logo" width="50" />
        </Link>
        <h2>Регистрация</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин (мин. 3 символа)</label>
            <input
              type="text"
              minLength={3}
              required
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Пароль (мин. 6 символов)</label>
            <input
              type="password"
              minLength={6}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-input"
            />
          </div>

          {localError && <div className="error-msg">{localError}</div>}

          <button type="submit" className="btn btn-primary">
            Зарегистрироваться
          </button>
        </form>
        
        <div className="auth-footer">
          Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
        </div>
      </div>
    </div>
  );
};
