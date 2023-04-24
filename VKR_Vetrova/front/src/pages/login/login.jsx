import { observer } from "mobx-react-lite";
import React, { useState, useContext } from "react";
import { Context } from "../..";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { store } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleLogin(email, password) {
    try {
      await store.login(email, password);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <div className={styles.enter}>Вход</div>
        <div className={styles.element}>
          <p>Введите почту</p>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
        </div>
        <div className={styles.element}>
          <p>Введите пароль</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="password"
          />
        </div>
        <div className={styles.under}>
           <p style={{cursor: 'pointer'}} onClick={() => {navigate('/registration')}}>Зарегистрироваться</p> 
           <p style={{cursor: 'pointer'}}  onClick={() => {navigate('/reset-password')}}>Забыл пароль</p>
        </div>
        <div className={styles}>
          <button
            onClick={() => {
              handleLogin(email, password);
            }}
          >
            Войти
          </button>
        </div>
        <p>Остаться гостем</p>
      </div>
    </div>
  );
};

export default observer(LoginPage);
