import styles from "./components.module.css";
import React from "react";
import { observer } from "mobx-react-lite";

const SpeedResults = ({ bestResult, averageResult }) => {
  if (!bestResult || !averageResult) {
    return <div className={styles.results}>Данные отсутствуют...</div>;
  }

  return (
    <div className={styles.results}>
      <div className={styles.resultsDivs}>
        <div>
          <p className={styles.best}>Лучший результат:</p>
          <p>Загрузка: {bestResult.uploadSpeed} мб/c</p>
          <p>Скачивание: {bestResult.downloadSpeed} мб/c</p>
          <p>Задержка: {bestResult.ping} мс</p>
        </div>
        <div>
          <p className={styles.best}>Средний результат:</p>
          <p>Загрузка: {averageResult.uploadSpeed} мб/c</p>
          <p>Скачивание: {averageResult.downloadSpeed} мб/c</p>
          <p>Задержка: {averageResult.ping} мс</p>
        </div>
      </div>
    </div>
  );
};

export default observer(SpeedResults);
