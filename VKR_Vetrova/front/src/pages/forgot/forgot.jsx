import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import styles from "./forgot.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../profile/ip/components/Header";

const ForgotPage = () => {
  const { store } = useContext(Context);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [enter, setEnter] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [stage, setStage] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();

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

  const validateEmail = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setEmailValid(emailRegex.test(email));
  };

  async function handleResetRequest() {
    setStage(true)
    try {
      if (!emailValid) {
        return;
      }

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

  async function handleCodeValidation() {
    if (enter == code) {
      setStep(3);
    } else {
      setError("неверный код");
    }
  }

  async function handlePasswordReset() {
    try {
      await store.changePassword(email, password);
      navigate("/login");
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.label}>Восстановление пароля</div>
          {step === 1 && (
            <>
              <div className={styles.inputs}>
                <div className={styles.inputsLabel}>email</div>
                <input
                  type="text"
                  onBlur={validateEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="введите email"
                />
                {stage && !emailValid && (
                  <div className={styles.errorText}>
                    Неверный формат электронной почты
                  </div>
                )}
              </div>
              <button
                className={styles.button}
                onClick={() => handleResetRequest()}
                disabled={timerActive ? true : false}
              >
                {timerActive ? `${timer}` : "Отправить код"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.inputs}>
                <div className={styles.inputsLabel}>код с почты</div>
                <input
                  type="text"
                  onChange={(e) => setEnter(e.target.value)}
                  value={enter}
                  placeholder="введите код"
                />
              </div>
              <div className={styles.errorText}>{error}</div>
              <button className={styles.button} onClick={() => handleCodeValidation()}>
                Проверить код
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className={styles.inputs}>
                <div className={styles.inputsLabel}>новый пароль</div>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="введите новый пароль"
                />
              </div>
              <button className={styles.button} onClick={() => handlePasswordReset()}>
                Обновить пароль
              </button>
            </>
          )}
        </div>
        <div className={styles.underBlock}>
          <div className={styles.underChild}>
            <button
              className={styles.underChildButton}
              onClick={() => navigate("/login")}
            >
              войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ForgotPage);
