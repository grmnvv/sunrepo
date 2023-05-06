import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import Header from "../profile/ip/components/Header";
import styles from "./settings.module.css";

const Settings = () => {
  const { store } = useContext(Context);
  const [sizeDownload, setSizeDownload] = useState();
  const [sizeUpload, setSizeUpload] = useState(0);
  const [sizePing, setSizePing] = useState(0);
  const [unit, setUnit] = useState("mbps");
  useEffect(() => {
    store.refresh();
  }, []);
  return (
    <>
      <Header email={store.user.email} />
      <div className={styles.container}>
        <div className={styles.centered}>
          <div className={styles.article}>Это ваши настройки</div>
          <div>
            <div className={styles.change}>
              <div className={styles.textChange}>Размер пакета скачивания</div>
              <input
                className={styles.inputs}
                type="number"
                value={sizeDownload}
                onChange={(e) => {
                  setSizeDownload(e.target.value);
                }}
              />
            </div>
            <div className={styles.change}>
              <div className={styles.textChange}>Размер пакета загрузки</div>
              <input
                className={styles.inputs}
                type="number"
                value={setSizeUpload}
                onChange={(e) => {
                  setSizeUpload(e.target.value);
                }}
              />
            </div>
            <div className={styles.change}>
              <div className={styles.textChange}>Размер пакета пинга</div>
              <input
                className={styles.inputs}
                type="number"
                value={setSizePing}
                onChange={(e) => {
                  setSizePing(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.change}>
          <div className={styles.textChange}>Отображение скорости</div>
            <div className={styles.buttonGroup}>
            <button 
              className={`${styles.unitButton} ${unit === "mbps" ? styles.active : ""}`}
              onClick={() => setUnit("mbps")}
            >
              мб/с
            </button>
            <button 
              className={`${styles.unitButton} ${unit === "kbps" ? styles.active : ""}`}
              onClick={() => setUnit("kbps")}
            >
              кб/с
            </button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(Settings);
