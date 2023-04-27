import React, { useState, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../..";
import { Link } from "react-router-dom";
import styles from "./Ip.module.css";

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

const Ip = () => {
  const { store } = useContext(Context);
  useEffect(() => {
    store.getInfoIp();
  }, []);

  return (
    <div>
      {store.IpArray.map((item) => (
        <Link key={item._id} to={`/profile/ip/${item._id}`} className={styles.container}>
          <p>Время тестирования: {formatDateMoscowTimezone(item.createdAt)}</p>
          <p>IP: {item.ipAddress}</p>
        </Link>
      ))}
    </div>
  );
};

export default observer(Ip);
