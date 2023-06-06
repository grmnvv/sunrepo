import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import axios from "axios";
import styles from "./speed.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../profile/ip/components/Header";

const SpeedTest = ({
  downloadSize = 2000000,
  uploadSize = 2000000,
  pingSize = 64,
  type,
}) => {
  const { store } = useContext(Context);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, []);

  return (
    <>
      <Header email={store?.user.email}/>
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.label}>Speed</div>
          <h2>Скорость соединения</h2>
          <hr style={{ width: "100%" }} />
          <div>
            <p>Скорость скачивания: {download} мб/c</p>
            <p>Скорость загрузки: {upload} мб/c</p>
            <p>Ping: {ping} мс</p>
          </div>
          <button className={styles.button} onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
      </div>
    </>
  );
};

export default observer(SpeedTest);
