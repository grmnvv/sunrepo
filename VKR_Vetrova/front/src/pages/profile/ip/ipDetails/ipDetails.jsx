import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../../..";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import styles from "./IpDetails.module.css"; 

const formatDateMoscowTimezone = (dateString) => {
  const date = new Date(dateString);
  const offset = 3 * 60 * 60 * 1000;
  const moscowDate = new Date(date.getTime() + offset);
  return moscowDate.toLocaleString("ru", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const IpDetails = () => {
  const { store } = useContext(Context);
  const { id } = useParams();
  const ipDetails = store.IpArray.find(item => item._id === id);

  return ipDetails ? (
    <div className={styles.container}>
      <p>Время тестирования: {formatDateMoscowTimezone(ipDetails.createdAt)}</p>
      <p>IP: {ipDetails.ipAddress}</p>
      <p>City: {ipDetails.city}</p>
      {ipDetails.latitude && ipDetails.longitude && (
        <div className={styles.mapContainer}>
          <YMaps query={{ apikey: "ddeefd86-2d2c-4bd1-a1ec-34b1e774b08c" }}>
            <Map
              defaultState={{
                center: [ipDetails.latitude, ipDetails.longitude],
                zoom: 10,
              }}
              width="300px"
              height="200px"
              options={{ suppressMapOpenBlock: true }}
            >
            </Map>
          </YMaps>
        </div>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default observer(IpDetails);
