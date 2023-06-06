import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import styles from "./basic.module.css"; // use the basic styles
import Header from "../profile/ip/components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import SpeedTest from "../speedTest/speedTest";

const BasicTest = () => {
  const [browserInfo, setBrowserInfo] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);
  const { store } = useContext(Context);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {

      const downloadInfoData = await store.getNetworkDownloadSpeed();
      const uploadInfoData = await store.getNetworkUploadSpeed();
      setUpload(uploadInfoData.speed);
      setDownload(downloadInfoData);
      setPing(uploadInfoData.ping);
    }
    fetchData();
  }, []);



  useEffect(() => {
    setBrowserInfo(navigator.userAgent);

    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryInfo({
          level: battery.level * 100,
          charging: battery.charging,
        });
      });
    }
  }, []);

  return (
    <div className={styles.main}>
      <Header email={store?.user.email} />
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.label}>Базовый тест</div>
          <div className={styles.inputs}>
            <h2>Скорость соединения</h2>
            <hr />
            <div>
              <p>Скорость скачивания: {download} мб/c</p>
              <p>Скорость загрузки: {upload} мб/c</p>
              <p>Ping: {ping} мс</p>
            </div>
            <h2>Информация о браузере и компьютере:</h2>
            <hr />
            <div>
              <p style={{ margin: "15px 0 0 0" }}>{browserInfo}</p>
              <p style={{ margin: "15px 0 0 0" }}>
                Уровень заряда батареи: {batteryInfo?.level}%
              </p>
              <p style={{ margin: "15px 0 0 0" }}>
                Зарядка: {batteryInfo?.charging ? "да" : "нет"}
              </p>
            </div>
          </div>
          <button className={styles.button} onClick={() => navigate(-1)}>
          Назад
        </button>
        </div>
      </div>
    </div>
  );
};

export default observer(BasicTest);
