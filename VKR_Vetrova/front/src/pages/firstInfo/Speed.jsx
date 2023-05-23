import React, { useState, useContext, useEffect } from "react";
import { Context } from "../..";
import styles from "./speedtest.module.css";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { observer } from "mobx-react-lite";
import Header from "../profile/ip/components/Header";

const Speed = () => {
  const { store } = useContext(Context);
  const [ipInfo, setIpInfo] = useState(null);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");
  const [position, setPosition] = useState(null);
  const [check, setCheck] = useState(false);
  const [browserInfo, setBrowserInfo] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);

  const [speedType, setSpeedType] = useState(null);

  useEffect(() => {
    setSpeedType(
      document.cookie.replace(
        /(?:(?:^|.*;\s*)speed\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      )
    );
    setBrowserInfo(navigator.userAgent);
    store.refresh();
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
    if(store.isAuth){
      store.getSettings();
    }
  }, [store.isAuth]);

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
    <div className={styles.absolute}>
      <Header email={store.user.email} style={{position:'absolute'}} />
      <div className={styles.container}>
        <div className={styles.centered}>
          {!check && (
            <div className={styles.firstText}>
              <div style={{textAlign:'center'}}>Привет, {store.isAuth ? store.user.email : "гость"}</div>
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
            </div>
          )}
          {check && (
            <div>
              {speedType >= 1 && (
                <div>
                  <h2>Скорость соединения: </h2>
                  <hr />
                  <div>
                    <p>Скорость скачивания: {download} мб/c</p>
                    <p>Скорость загрузки: {upload} мб/c</p>
                    <p>Ping: {ping} мс</p>
                  </div>
                </div>
              )}

              {speedType >= 2 && (
                <div>
                  <h2>Информация о браузере и компьютере:</h2>
                  <hr />
                  <div>
                    <p>{browserInfo}</p>
                    <p>Уровень заряда батареи: {batteryInfo.level}%</p>
                    <p>Зарядка: {batteryInfo.charging ? "да" : "нет"}</p>
                  </div>
                </div>
              )}

              {speedType >= 3 && (
                <div>
                  <h2>Информация по IP:</h2>
                  <hr />
                  {ipInfo && (
                    <ul>
                      <li>IP: {ipInfo.ip}</li>
                      <li>Город: {ipInfo.city}</li>
                      <li>Страна: {ipInfo.country_name}</li>
                    </ul>
                  )}
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(Speed);
