import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import styles from "./forgot.module.css";
import { useNavigate } from "react-router-dom";

const ForgotPage = () => {
  const { store } = useContext(Context);
const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [enter, setEnter] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  async function sendCode(email) {
    try {
      const Acode = Math.floor(Math.random() * 9000 * 1000);
      setCode(Acode);
      console.log(Acode);

      await store.sendCode(email, Acode);

      if (store.error === "") {
        setTimer(60);
        setTimerActive(true);
        setStep(2);
      }

      console.log(store.error);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  function checkCode() {
    console.log(enter);
    console.log(code);
    if (enter == code) {
      setStep(3);
    } else {
      setError("Неверный код");
    }
  }

  async function changePassword(email, password) {
    try {
      await store.changePassword(email, password);
      navigate('/login')
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  if (store.isLoading) {
    return <div>Загрузка</div>;
  }

  return (
    <div className={styles.container}>
      {step === 1 && (
        <div className={styles.centered}>
          <p>Введите адрес электронной почты</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
          <button
            onClick={() => {
              sendCode(email);
            }}
            disabled={timerActive}
          >
            {timerActive ? `Отправить код через ${timer}` : "Отправить код"}
          </button>
          {store.error}
        </div>
      )}
      {step === 2 && (
        <div className={styles.centered}>
          <p>Введите код</p>
          <input
            type="text"
            onChange={(e) => setEnter(e.target.value)}
            value={enter}
            placeholder="Код"
          />
          <button onClick={checkCode}>Проверить код</button>
          <button
            onClick={() => {
              setStep(1);
            }}
          >
            Назад
          </button>
        </div>
      )}
      {step === 3 && (
        <div className={styles.centered}>
          <p>Введите новый пароль</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Пароль"
          />
          <button onClick={() => changePassword(email, password)}>
            Сохранить пароль
          </button>
          <button
            onClick={() => {
              setStep(2);
            }}
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
};

export default observer(ForgotPage);
