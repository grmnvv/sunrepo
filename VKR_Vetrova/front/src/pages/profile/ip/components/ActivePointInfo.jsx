import styles from './components.module.css';
import React from 'react';
import { observer } from 'mobx-react-lite';


const ActivePointInfo = ({ point, position }) => {
  return (
    <div className={styles.pointInfo} style={{ top: position.y - 60, left: position.x - 50 }}>
      <p style={{ fontSize: "14px" }}>Дата измерения: {point.createdAt}</p>
      <p style={{ fontSize: "14px" }}>Скорость скачивания: {point.downloadSpeed} мб/с</p>
      <p style={{ fontSize: "14px" }}>Скорость загрузки: {point.uploadSpeed} мб/с</p>
    </div>
  );
};

export default observer(ActivePointInfo);
