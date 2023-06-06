import { observer } from "mobx-react-lite";
import React, { useState, useContext, useEffect } from "react";
import Header from "../profile/ip/components/Header";
import { Context } from "../..";
import styles from "./MainPage.module.css";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    store.refresh();
  }, []);
  return (
    <div className={styles.main}>
      <Header email={store?.user.email}/>
      <div className={styles.container}>
        <div className={styles.blocks}>
          <div className={styles.inblocks}>
            <div className={styles.blockTitle}>Speed</div>
            <hr />
            <div className={styles.punkts}>
              <div className={styles.newPunkts}>скорость загрузки</div>
              <div className={styles.newPunkts}>скорость скачивания</div>
              <div className={styles.newPunkts}>время задержки</div>
            </div>
          </div>
          <button className={styles.button} onClick={() => navigate('/speedTest')}>проверить</button>
        </div>
        <div className={styles.blocks}>
          <div className={styles.inblocks}>
            <div className={styles.blockTitle}>Basic</div>
            <hr />
            <div className={styles.punkts}>
              <div className={styles.oldPunkts}>скорость загрузки</div>
              <div className={styles.oldPunkts}>скорость скачивания</div>
              <div className={styles.oldPunkts}>время задержки</div>
              <div className={styles.newPunkts}>IP адрес</div>
              <div className={styles.newPunkts}>местоположение по IP</div>
              <div className={styles.newPunkts}>
                сохраним информацию в профиль
              </div>
              <div className={styles.newPunkts}>
                выгрузка отчетов о тестированиях
              </div>
              <div className={styles.newPunkts}>просмотр истории проверок</div>
            </div>
          </div>
          <button className={styles.button} onClick={() => navigate(store.isAuth ? '/basicTest' : '/login')}>{store.isAuth ? 'проверить' : 'войти'}</button>
        </div>
        <div className={styles.blocks}>
          <div className={styles.inblocks}>
            <div className={styles.blockTitle}>Comfort</div>
            <hr />
            <div className={styles.punkts}>
              <div className={styles.oldPunkts}>скорость загрузки</div>
              <div className={styles.oldPunkts}>скорость скачивания</div>
              <div className={styles.oldPunkts}>время задержки</div>
              <div className={styles.oldPunkts}>IP адрес</div>
              <div className={styles.oldPunkts}>местоположение по IP</div>
              <div className={styles.oldPunkts}>
                сохраним информацию в профиль
              </div>
              <div className={styles.oldPunkts}>
                выгрузка отчетов о тестированиях
              </div>
              <div className={styles.oldPunkts}>просмотр истории проверок</div>
              <div className={styles.newPunkts}>
                полная настройка тестирования
              </div>
            </div>
          </div>
          <button className={styles.button} onClick={() => navigate(store.isAuth ? '/comfortTest' : '/login')}>{store.isAuth ? 'проверить' : 'войти'}</button>
        </div>
      </div>
    </div>
  );
};

export default observer(MainPage);
