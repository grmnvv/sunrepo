
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

  const [ipSettings, setIpSettings] = useState([]);
  const [browserSettings, setBrowserSettings] = useState([]);

  useEffect(() => {
    store.refresh();
    store.getSettings();
  }, []);

  useEffect(() => {
    const settings = store.Settings;
    if (settings.ipSettings && settings.browserSettings) {
      setSizeDownload(settings.download);
      setSizeUpload(settings.upload);
      setSizePing(settings.ping);
      setUnit(settings.mb);

      setIpSettings(
        settings.ipSettings.map((setting) => ({
          key: setting.key,
          display: setting.display,
          isChecked: setting.isChecked,
        }))
      );

      setBrowserSettings(
        settings.browserSettings.map((setting) => ({
          key: setting.key,
          display: setting.display,
          isChecked: setting.isChecked,
        }))
      );
    }
  }, [store.Settings]);

  function handleUpdate() {
    store.updateSettings(
      sizeDownload,
      sizeUpload,
      sizePing,
      unit,
      ipSettings,
      browserSettings
    );
  }

  return (
    <>
      <Header email={store.user.email} />
      <div className={styles.container}>
      <div style={{marginTop:'150px'}} className={styles.settingsBlock}>
          <div className={styles.blockTitle}>Настройки соединения</div>
          <div className={styles.change}>
            <div className={styles.textChange}>Размер пакета скачивания, <span style={{fontSize:'12px'}}>байт</span></div>
            <input
              className={styles.inputs}
              type="number"
              value={sizeDownload}
              onBlur={handleUpdate}
              onChange={(e) => {
                setSizeDownload(e.target.value);
              }}
            />

          </div>
          <div className={styles.change}>
            <div className={styles.textChange}>Размер пакета загрузки, <span style={{fontSize:'12px'}}>байт</span></div>
            <input
              className={styles.inputs}
              type="number"
              value={sizeUpload}
              onBlur={handleUpdate}
              onChange={(e) => {
                setSizeUpload(e.target.value);
              }}
            />
          </div>
          <div className={styles.change}>
            <div className={styles.textChange}>Размер пакета пинга, <span style={{fontSize:'12px'}}>байт</span></div>
            <input
              className={styles.inputs}
              type="number"
              value={sizePing}
              onBlur={handleUpdate}
              onChange={(e) => {
                setSizePing(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.settingsBlock}>
          <div className={styles.blockTitle}>Настройки IP</div>
          {ipSettings.map((item) => (
            <div className={styles.settingItem} key={item.key}>
              <p>{item.display}</p>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => {
                    const updatedIpSettings = ipSettings.map((x) =>
                      x.key === item.key ? { ...x, isChecked: !x.isChecked } : x
                    );
                    setIpSettings(updatedIpSettings);
                  }}
                />
                <span className={styles.checkmark}></span>
              </label>
            </div>
          ))}
        </div>
        <div className={styles.settingsBlock}>
          <div className={styles.blockTitle}>Настройки браузера</div>
          {browserSettings.map((item) => (
            <div className={styles.settingItem} key={item.key}>
              <p>{item.display}</p>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => {
                    const updatedBrowserSettings = browserSettings.map((x) =>
                      x.key === item.key ? { ...x, isChecked: !x.isChecked } : x
                    );
                    setBrowserSettings(updatedBrowserSettings);
                  }}
                />
                <span className={styles.checkmark}></span>
              </label>
            </div>
          ))}
        </div>
        <button className={styles.saveButton} onClick={handleUpdate}>
          Сохранить настройки
        </button>
      </div>
    </>
  );
};

export default observer(Settings);
