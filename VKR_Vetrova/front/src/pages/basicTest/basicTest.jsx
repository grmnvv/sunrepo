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
  const [position, setPosition] = useState(null);
  const [isTesting, setIsTesting] = useState(true); 

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsTesting(true)
      const downloadInfoData = await store.getNetworkDownloadSpeed(

      );
      const uploadInfoData = await store.getNetworkUploadSpeed(

      );
      setUpload(uploadInfoData.speed);
      setDownload(downloadInfoData);
      setPing(uploadInfoData.ping);
      setIsTesting(false)
      const ipInfoData = await getIp();
      if (ipInfoData) {
        store.updateInfoIp(
          ipInfoData.ip,
          ipInfoData.city,
          ipInfoData.latitude,
          ipInfoData.longitude
        );
      }
      if (downloadInfoData && uploadInfoData) {
        store.updateInfoConnection(
          downloadInfoData,
          uploadInfoData.speed,
          uploadInfoData.ping
        );
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    store.refresh();

    fetchData();
  }, []);
  const fetchData = async () => {
    const ipInfoData = await getIp();
    setIpInfo(ipInfoData);
    setPosition([ipInfoData.latitude, ipInfoData.longitude]);
  };

  const getIp = async () => {
    try {
      const ipifyUrl = `https://api.ipify.org?format=json`;
      const response = await axios.get(ipifyUrl);
      const ip = response.data.ip;
      const ipinfo = await getIpInfo(ip);
      return ipinfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getIpInfo = async (ip) => {
    try {
      const ipapiUrl = `https://ipapi.co/${ip}/json/`;
      const response = await axios.get(ipapiUrl);
      const ipInfo = response.data;
      return ipInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

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
            {isTesting ? ( // если идет тестирование, показываем сообщение
              <p>Идет тестирование...</p>
            ) : ( // если тестирование закончено, показываем результаты
              <>
                <p>Скорость скачивания: {download} мб/c</p>
                <p>Скорость загрузки: {upload} мб/c</p>
                <p>Ping: {ping} мс</p>
              </>
            )}
          </div>
            <div className={styles.inputsLabel}>Информация по IP:</div>
            <hr />
            {ipInfo ? (
              <div>
                <p style={{ margin: "15px 0 0 0" }}>IP: {ipInfo.ip}</p>
                <p style={{ margin: "15px 0 0 0" }}>Город: {ipInfo.city}</p>
                <p style={{ margin: "15px 0 0 0" }}>
                  Страна: {ipInfo.country_name}
                </p>
                
              </div>
            ) : (
              <p>Загрузка информации IP...</p>
            )}
          </div>
          {position ? (
            <YMaps>
              <Map
                defaultState={{ center: position, zoom: 9 }}
                style={{ width: "100%", height: "400px" }}
                options={{ suppressMapOpenBlock: true }}
              >
                <Placemark geometry={position} />
              </Map>
            </YMaps>
          ) : (
            <p>Загрузка карты...</p>
          )}

          <button className={styles.button} onClick={() => navigate(-1)}>
          Назад
        </button>
        </div>
      </div>
    </div>
  );
};

export default observer(BasicTest);
