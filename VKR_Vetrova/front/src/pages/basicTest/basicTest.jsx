import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import SpeedTest from "../speedTest/speedTest";

const BasicTest = () => {
  const [browserInfo, setBrowserInfo] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);

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
    <div>
        <SpeedTest />
      <h2>Информация о браузере и компьютере:</h2>
      <hr />
      <div>
        <p>{browserInfo}</p>
        <p>Уровень заряда батареи: {batteryInfo?.level}%</p>
        <p>Зарядка: {batteryInfo?.charging ? "да" : "нет"}</p>
      </div>
    </div>
  );
};

export default observer(BasicTest);
