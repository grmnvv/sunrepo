import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import BasicTest from "../basicTest/basicTest";
import styles from "./comfort.module.css";
import Header from "../profile/ip/components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import SpeedT from "../speedTest/speedTest";
import SpeedTest from "../speedTest/speedTest";

const ComfortTest = () => {
  const { store } = useContext(Context);
  const [downloadSize, setDownloadSize] = useState("");
  const [uploadSize, setUploadSize] = useState("");
  const [pingSize, setPingSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [browserSettings, setBrowserSettings] = useState([]);
  const [ipSettings, setIpSettings] = useState([]);
  const [ipInfo, setIpInfo] = useState(null);
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();
  const [browserInfo, setBrowserInfo] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");
  const [isTesting, setIsTesting] = useState(true); 

  useEffect(() => {
    async function fetchData() {
      setIsTesting(true);
      const downloadInfoData = await store.getNetworkDownloadSpeed(
        downloadSize
      );
      const uploadInfoData = await store.getNetworkUploadSpeed(
        uploadSize,
        pingSize
      );
      setUpload(uploadInfoData.speed);
      setDownload(downloadInfoData);
      setPing(uploadInfoData.ping);
      setIsTesting(false);
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
  }, [uploadSize, downloadSize, pingSize]);

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
  useEffect(() => {
    store.refresh();
    store.getSettings();
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);

    const settings = store.Settings;
    console.log(settings);
    if (settings.ipSettings && settings.browserSettings) {
      setDownloadSize(settings.download);
      setUploadSize(settings.upload);
      setPingSize(settings.ping);
      setBrowserSettings(settings.browserSettings);
      setIpSettings(settings.ipSettings);
    }
  }, [store.Settings]);

  useEffect(() => {
    console.log(browserSettings);
  }, [browserSettings]);

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

  return (
    <div className={styles.main}>
      <Header email={store?.user.email} />
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.label}>Комфортный тест</div>
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

            <div className={styles.inputsLabel}>
              Информация о браузере и компьютере:
            </div>
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
            {browserSettings.map((setting) => {
              if (setting.isChecked) {
                return (
                  <p style={{ margin: "15px 0 0 0" }}>
                    {setting.display}: {navigator[setting.key]}
                  </p>
                );
              }
              return null;
            })}

            <div className={styles.inputsLabel}>Информация по IP:</div>
            <hr />
            {ipInfo ? (
              <div>
                <p style={{ margin: "15px 0 0 0" }}>IP: {ipInfo.ip}</p>
                <p style={{ margin: "15px 0 0 0" }}>Город: {ipInfo.city}</p>
                <p style={{ margin: "15px 0 0 0" }}>
                  Страна: {ipInfo.country_name}
                </p>
                {ipSettings.map((setting) => {
                  if (setting.isChecked) {
                    return (
                      <p key={setting._id} style={{ margin: "15px 0 0 0" }}>
                        {setting.display}: {ipInfo[setting.key]}
                      </p>
                    );
                  }
                  return null;
                })}
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
          <button className={styles.logBtn} onClick={() => navigate("/")}>
            назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(ComfortTest);
