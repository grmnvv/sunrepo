import { observer } from "mobx-react-lite";
import React, { useState, useContext } from "react";
import { Context } from "../..";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { store } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const navigate = useNavigate();

  async function handleRegister(email, password, login) {
    try {
      await store.registration(email, password, login);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <div className={styles.enter}>Регистрация</div>
        <div className={styles.element}>
          <p>Введите почту</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
        </div>
        <div className={styles.element}>
          <p>Введите логин</p>
          <input
            type="text"
            onChange={(e) => setLogin(e.target.value)}
            value={login}
            placeholder="Логин"
          />
        </div>
        <div className={styles.element}>
          <p>Введите пароль</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Пароль"
          />
        </div>
        <div className={styles.under}>
          <p style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
            Уже зарегистрированы? Войти
          </p>
        </div>
        <div className={styles}>
          <button
            onClick={() => {
              handleRegister(email, password, login);
            }}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(RegisterPage);
