import { observer } from "mobx-react-lite";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../..";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../profile/ip/components/Header";

const RegisterPage = () => {
  const { store } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [step, setStep] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [validation, setValidation] = useState({
    "длина не менее 8 символов": null,
    "минимум 1 спец. символ": null,
    "минимум 2 цифры": null,
    "минимум 1 заглавная буква": null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    store.refresh();
    store.setError('')
  }, []);

  useEffect(() => {
    if (store.isAuth) {
      navigate("/");
    }
  }, [store.isAuth]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  useEffect(() => {
    validatePasswordConfirm(passwordConfirm);
  }, [passwordConfirm]);

  const validateEmail = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    console.log(emailRegex.test(email))
    setEmailValid(emailRegex.test(email));
  };


  const handlePasswordValidate = (password) => {
    const validation = {
      "длина не менее 8 символов": password.length >= 8,
      "минимум 1 спец. символ": /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(
        password
      ),
      "минимум 2 цифры": (password.match(/\d/g) || []).length >= 2,
      "минимум 1 заглавная буква": /[A-Z]/.test(password),
    };
    return Object.values(validation).every((value) => value === true);
  };

  const validatePassword = (password) => {
    setValidation({
      "длина не менее 8 символов": password.length >= 8,
      "минимум 1 спец. символ": /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(
        password
      ),
      "минимум 2 цифры": (password.match(/\d/g) || []).length >= 2,
      "минимум 1 заглавная буква": /[A-Z]/.test(password),
    });
  };

  const validatePasswordConfirm = (passwordConfirm) => {
    setConfirmPasswordValid(password === passwordConfirm);
  };

  async function handleRegister() {
    setStep(true);
    if (
      !emailValid ||
      !confirmPasswordValid ||
      !handlePasswordValidate(password)
    ) {
      return;
    }

    try {
      await store.registration(email, password, login);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.label}>Регистрация</div>
          <div className={styles.inputs}>
            <div className={styles.inputsLabel}>email</div>
            <input
              type="text"
              onBlur={validateEmail}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="введите email"
            />
            {step && !emailValid && (
              <div className={styles.errorText}>
                Неверный формат электронной почты
              </div>
            )}
          </div>

          <div className={styles.inputs}>
            <div className={styles.inputsLabel}>пароль</div>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="введите пароль"
            />
            {step && Object.entries(validation).map(([key, value]) =>
              value === false ? (
                <p key={key} className={styles.errorText}>
                  {key}
                </p>
              ) : null
            )}
          </div>
          <div className={styles.inputs}>
            <div className={styles.inputsLabel}>подтвердите пароль</div>
            <input
              type="password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={passwordConfirm}
              placeholder="подтвердите пароль"
            />
            {!confirmPasswordValid && (
              <div className={styles.errorText}>Пароли не совпадают</div>
            )}
          </div>
          <div className={styles.error}>
            {store.error !== '' && store.error}
          </div>
          <button className={styles.button} onClick={() => handleRegister()}>
            зарегистрироваться
          </button>
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

export default observer(RegisterPage);
