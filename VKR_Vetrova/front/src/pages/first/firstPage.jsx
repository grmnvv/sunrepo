import React, { useEffect, useState, useContext } from "react";
import styles from "./first.module.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import { ReactComponent as Lock } from "./../../assets/material-symbols_lock.svg";
import { observer } from "mobx-react-lite";
import Header from "../profile/ip/components/Header";

const MainPage = () => {
  const [step, setStep] = useState(0);
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies("speed");

  useEffect(() => {
    setTimeout(() => {
      setStep(1);
    }, 3500);
    store.refresh();
  }, []);

  const handleCardClick = (type) => {
    if (type === "speed") {
      navigate("/speedTest");
    } else if (store.isAuth) {
      navigate(type === "basic" ? "/basicTest" : "/comfortTest");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.absolute}>
      <Header email={store.user.email} style={step == 0 ? {position:'absolute'} : {}}/>
      <div className={styles.container} style={step == 0 ? {margin: '0 0 0 0', alignItems:'center'} : {}}>
        {step === 0 && (
          <div className={[styles.animation, styles.centered]}>
            <div className={styles.firstText}>Привет! Проверим скорость?</div>
          </div>
        )}
        {step === 1 && (
          <div className={styles.centeredFirst}>
            <div className={styles.check}>
              <p className={styles.large} style={{ marginBottom: "100px" }}>
                Выберите тип проверки
              </p>
            </div>
            <div
              className={styles.box}
              onClick={() => handleCardClick("speed")}
            >
              <p className={styles.large}>Speed</p>
              <p className={styles.mini}>Самая быстрая проверка</p>
              <p className={styles.mini}>
                Проверим скорость без лишней информации
              </p>
            </div>
            <div
              className={styles.box}
              onClick={() => handleCardClick("basic")}
            >
              {!store.isAuth && (
                <div className={styles.blurText}>
                  <div style={{ textAlign: "center" }}>
                    <Lock />
                  </div>{" "}
                  Авторизоваться
                </div>
              )}
              <div className={store.isAuth ? "" : styles.blur}>
                <p className={styles.large}>Basic</p>
                <p className={styles.mini}>Средняя проверка</p>
                <p className={styles.mini}>
                  Проверим скорость и выведем информацию о браузере
                </p>
              </div>
            </div>
            <div
              className={styles.box}
              onClick={() => handleCardClick("comfort")}
            >
              {!store.isAuth && (
                <div className={styles.blurText}>
                  <div style={{ textAlign: "center" }}>
                    <Lock />
                  </div>{" "}
                  Авторизоваться
                </div>
              )}
              <div className={store.isAuth ? "" : styles.blur}>
                <p className={styles.large}>Comfort</p>
                <p className={styles.mini}>Полная проверка</p>
                <p className={styles.mini}>
                  Проверим скорость, выведем всю информацию об IP, браузере и
                  скорости
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(MainPage);
