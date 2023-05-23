import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const SpeedTest = ({downloadSize = 2000000, uploadSize=2000000, pingSize=64}) => {
  const { store } = useContext(Context);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");

  useEffect(() => {
    async function fetchData() {
      const downloadInfoData = await store.getNetworkDownloadSpeed(downloadSize);
      const uploadInfoData = await store.getNetworkUploadSpeed(uploadSize, pingSize);
      setUpload(uploadInfoData.speed);
      setDownload(downloadInfoData);
      setPing(uploadInfoData.ping);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Скорость соединения:</h2>
      <hr />
      <div>
        <p>Скорость скачивания: {download} мб/c</p>
        <p>Скорость загрузки: {upload} мб/c</p>
        <p>Ping: {ping} мс</p>
      </div>
    </div>
  );
};

export default observer(SpeedTest);
