import React, { useEffect, useState } from "react";
import styles from "./first.module.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(0);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies("speed");
  useEffect(() => {
    setTimeout(() => {
      setStep(1);
    }, 3500);
  }, []);
  function handleContinue() {
    setCookie("speed", speed);
    navigate("/login");
  }
  return (
    <div className={styles.container}>
      {step == 0 && (
        <div className={[styles.animation, styles.centered]}>
          <div className={styles.firstText}>Привет! Проверим скорость?</div>
        </div>
      )}
      {step == 1 && (
        <div className={styles.centeredFirst}>
          <div className={styles.check}>
            <p className={styles.large}>Выберите тип проверки</p>
            <p className={styles.mini}>
              Вы всегда можете это изменить в профиле
            </p>
          </div>
          <div
            className={speed == 1 ? styles.selected : styles.box}
            onClick={() => {
              setSpeed(1);
            }}
          >
            <p className={styles.large}>Speed</p>
            <p className={styles.mini}>Самая быстрая проверка</p>
            <p className={styles.mini}>
              Проверим скорость без лишней информации
            </p>
          </div>
          <div
            className={speed == 2 ? styles.selected : styles.box}
            onClick={() => {
              setSpeed(2);
            }}
          >
            <p className={styles.large}>Basic</p>
            <p className={styles.mini}>Средняя проверка</p>
            <p className={styles.mini}>
              Проверим скорость и выведем информацию о браузере
            </p>
          </div>
          <div
            className={speed == 3 ? styles.selected : styles.box}
            onClick={() => {
              setSpeed(3);
            }}
          >
            <p className={styles.large}>Comfort</p>
            <p className={styles.mini}>Полная проверка</p>
            <p className={styles.mini}>
              Проверим скорость, выведем всю информацию об IP, браузере и
              скорости
            </p>
          </div>

          <div
            className={styles.large}
            onClick={() => {
              handleContinue();
            }}
          >
            Дальше
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
