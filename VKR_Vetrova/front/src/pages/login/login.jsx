import { observer } from "mobx-react-lite";
import React, { useState, useContext } from "react";
import { Context } from "../..";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../profile/ip/components/Header";

const LoginPage = () => {
  const { store } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {

      console.log('gfs')
      await store.login(email, password);

  }
  useEffect(() => {
    store.setError('')
    store.refresh();
  }, []);
  useEffect(() => {
    if (store.isAuth) {
      navigate("/");
    }
  }, [store.isAuth]);

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.label}>Вход</div>
          <div className={styles.inputs}>
            <div className={styles.inputsLabel}>email</div>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="введите email"
            />
          </div>
          <div className={styles.inputs}>
            <div className={styles.inputsLabel}>пароль</div>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="введите пароль"
            />
          </div>
          <div className={styles.error}>
            {store.error !== '' && store.error}
          </div>
          
          <button className={styles.button} onClick={() => {handleLogin()}}>
            войти
          </button>
        </div>
        <div className={styles.underBlock}>
          <div className={styles.underChild}>
            <button className={styles.underChildButton} onClick={() => navigate('/registration')}>зарегистрироваться</button>
          </div>
          <div className={styles.underChild}>
            <button className={styles.underChildButton} onClick={() => navigate('/reset-password')}>забыл пароль</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginPage);
