import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import Header from "../profile/ip/components/Header";
import styles from "./settings.module.css";

const Settings = () => {
  const { store } = useContext(Context);
  const [sizeDownload, setSizeDownload] = useState(0);
  const [sizeUpload, setSizeUpload] = useState(0);
  const [sizePing, setSizePing] = useState(0);
  const [unit, setUnit] = useState("");

  const [ipSettings, setIpSettings] = useState([
    { id: "index", display: "Индекс", isChecked: false },
    { id: "provider", display: "Провайдер", isChecked: false },
    { id: "utc", display: "UTC", isChecked: false },
    { id: "connectionVersion", display: "Версия соединения", isChecked: false },
  ]);

  const [browserSettings, setBrowserSettings] = useState([
    { id: "appCodeName", display: "browser code name", isChecked: false },
    { id: "appName", display: "browser name", isChecked: false },
    { id: "appVersion", display: "browser version", isChecked: false },
    { id: "cookieEnabled", display: "browser cookies", isChecked: false },
    { id: "platform", display: "browser platform", isChecked: false },
    {
      id: "product",
      display: "browser engine name",
      isChecked: false,
    },
    {
      id: "userAgent",
      display: "browser user-agent header",
      isChecked: false,
    },
  ]);

  useEffect(() => {
    store.refresh();
    store.getSettings();
  }, []);

  useEffect(() => {
    const settings = store.Settings;
    if(settings.ipSettings){
      setSizeDownload(settings.download);
      setSizeUpload(settings.upload);
      setSizePing(settings.ping);
      setUnit(settings.mb);
  
  
      const ipSettingsFromStore = [
        { id: "index", display: "Индекс", isChecked: settings.ipSettings.index },
        { id: "provider", display: "Провайдер", isChecked: settings.ipSettings.provider },
        { id: "utc", display: "UTC", isChecked: settings.ipSettings.utc },
        { id: "connectionVersion", display: "Версия соединения", isChecked: settings.ipSettings.connectionVersion },
      ];
  
      const browserSettingsFromStore = [
        { id: "appCodeName", display: "Browser Code Name", isChecked: settings.browserSettings.appCodeName },
        { id: "appName", display: "Browser Name", isChecked: settings.browserSettings.appName },
        { id: "appVersion", display: "Browser Version", isChecked: settings.browserSettings.appVersion },
        { id: "cookieEnabled", display: "Browser Cookies", isChecked: settings.browserSettings.cookieEnabled },
        { id: "platform", display: "Browser Platform", isChecked: settings.browserSettings.platform },
        { id: "product", display: "Browser Engine Name", isChecked: settings.browserSettings.product },
        { id: "userAgent", display: "Browser User-Agent Header", isChecked: settings.browserSettings.userAgent },
      ];
  
      setIpSettings(ipSettingsFromStore);
      setBrowserSettings(browserSettingsFromStore);
    }
    
    

  }, [store.Settings]);


  useEffect(() => {
    if(sizeDownload, sizeUpload, sizePing, unit){
      handleUpdate()
    }
  }, [ipSettings, browserSettings]);

  function handleUpdate(mb = unit) {
    store.updateSettings(sizeDownload, sizeUpload, sizePing, mb, ipSettings, browserSettings);
  }
  
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
                onBlur={() => handleUpdate()}
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
                value={sizeUpload}
                onBlur={() => handleUpdate()}
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
                value={sizePing}
                onBlur={() => handleUpdate()}
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
                className={`${styles.unitButton} ${
                  unit === "mbps" ? styles.active : ""
                }`}
                onClick={() => {
                  setUnit("mbps");
                  handleUpdate("mbps");
                }}
              >
                мб/с
              </button>
              <button
                className={`${styles.unitButton} ${
                  unit === "kbps" ? styles.active : ""
                }`}
                onClick={() => {
                  setUnit("kbps");
                  handleUpdate("kbps");
                }}
              >
                кб/с
              </button>
            </div>
          </div>
          <div className={styles.article}>Дополнительные настройки IP</div>
          {ipSettings.map((item) => (
            <div className={styles.ipAddConnection} key={item.id}>
              <p>{item.display}</p>
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => {
                  const index = ipSettings.findIndex((x) => x.id === item.id);
                  ipSettings[index].isChecked = !item.isChecked;
                  setIpSettings([...ipSettings]);
                }}
              />
            </div>
          ))}
          <div className={styles.article}>
            Дополнительная информация о браузере
          </div>
          {browserSettings.map((item) => (
            <div className={styles.change} key={item.id}>
              <p>{item.display}</p>
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => {
                  const index = browserSettings.findIndex(
                    (x) => x.id === item.id
                  );
                  browserSettings[index].isChecked = !item.isChecked;
                  setBrowserSettings([...browserSettings]);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default observer(Settings);
