import styles from "./components.module.css";
import React from "react";
import { observer } from "mobx-react-lite";

const SpeedResults = ({ bestResult, averageResult }) => {
  if (!bestResult || !averageResult) {
    return <div className={styles.results}>Данные загружаются...</div>;
  }

  return (
    <div className={styles.results}>
      <div>
        <p>Лучший результат:</p>
        <p>Upload: {bestResult.uploadSpeed}</p>
        <p>Download: {bestResult.downloadSpeed}</p>
        <p>Ping: {bestResult.ping}</p>
      </div>
      <div>
        <p>Средний результат:</p>
        <p>Upload: {averageResult.uploadSpeed}</p>
        <p>Download: {averageResult.downloadSpeed}</p>
        <p>Ping: {averageResult.ping}</p>
      </div>
    </div>
  );
};

export default observer(SpeedResults);
