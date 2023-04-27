import React, { useState, useContext, useEffect } from "react";
import { Context } from "../..";
import styles from "./speedtest.module.css";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-localhost-maps";
import { observer } from "mobx-react-lite";

const SpeedTest = () => {
  const { store } = useContext(Context);
  const [ipInfo, setIpInfo] = useState(null);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");
  const [position, setPosition] = useState(null);
  const [check, setCheck] = useState(false);
  const [browserInfo, setBrowserInfo] = useState(null);

  useEffect(() => {
    setBrowserInfo(navigator.userAgent);
    store.refresh();
  }, []);

  async function fetchData() {
    setCheck(true);
    const ipInfoData = await getIp();
    const downloadInfoData = await store.getNetworkDownloadSpeed();
    const uploadInfoData = await store.getNetworkUploadSpeed();
    setUpload(uploadInfoData.speed);
    setDownload(downloadInfoData);
    setPing(uploadInfoData.ping);
    if (ipInfoData) {
      store.updateInfoIp(
        ipInfoData.ip,
        ipInfoData.city,
        ipInfoData.latitude,
        ipInfoData.longitude
      );
      setPosition([ipInfoData.latitude, ipInfoData.longitude]);
    }
    if (downloadInfoData && uploadInfoData) {
      store.updateInfoConnection(
        downloadInfoData,
        uploadInfoData.speed,
        uploadInfoData.ping
      );
    }
    setIpInfo(ipInfoData);
  }

  async function getIp() {
    try {
      const ipifyUrl = `https://api.ipify.org?format=json`;
      const response = await axios.get(ipifyUrl);
      const ip = response.data.ip;
      const ipinfo = await getIpInfo(ip);
      console.log(ipinfo);
      return ipinfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async function getIpInfo(ip) {
    try {
      const ipapiUrl = `https://ipapi.co/${ip}/json/`;
      const response = await axios.get(ipapiUrl);
      const ipInfo = response.data;
      return ipInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <div>
          {!check && (
            <div className={styles.firstText}>
              <div>Привет, {store.isAuth ? store.user.email : "гость"}</div>
              <div
                style={{
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                  margin: "30px 0 0 0",
                }}
                onClick={() => {
                  fetchData();
                }}
              >
                Провести тест
              </div>
              <div className={styles.mini}>или</div>
              <div className={styles.mini}>Исследовать профиль</div>
            </div>
          )}
          {check && (
            <div>
              <div>
                <h2>Скорость соединения: </h2>
              </div>
              <div>
                <p>Скорость скачивания: {download} мб/c</p>
                <p>Скорость загрузки: {upload} мб/c</p>
                <p>Ping: {ping} мс</p>
              </div>
              <div>
                <h2>Информация по IP:</h2>
                {ipInfo && (
                  <ul>
                    <li>IP: {ipInfo.ip}</li>
                    <li>Город: {ipInfo.city}</li>
                    <li>Страна: {ipInfo.country_name}</li>
                  </ul>
                )}
              </div>
              <div>
                <h2>Карта по IP:</h2>
                {position ? (
                  <YMaps
                    query={{ apikey: "ddeefd86-2d2c-4bd1-a1ec-34b1e774b08c" }}
                  >
                    <Map
                      defaultState={{
                        center: position,
                        zoom: 11,
                      }}
                      width="700px"
                      height="400px"
                      options={{ suppressMapOpenBlock: true }}
                    >
                      <Placemark geometry={position} />
                    </Map>
                  </YMaps>
                ) : (
                  <h1>Loading...</h1>
                )}
              </div>
              <div>
                <h2>Информация о браузере и компьютере:</h2>
                <p>{browserInfo}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(SpeedTest);
