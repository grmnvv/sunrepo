import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import axios from "axios";
const SpeedTest = ({downloadSize = 2000000, uploadSize=2000000, pingSize=64, type}) => {
  const { store } = useContext(Context);
  const [download, setDownload] = useState("");
  const [upload, setUpload] = useState("");
  const [ping, setPing] = useState("");
  const [ipInfo, setIpInfo] = useState(null);

  
  useEffect(() => {
    async function fetchData() {

      const downloadInfoData = await store.getNetworkDownloadSpeed(downloadSize);
      const uploadInfoData = await store.getNetworkUploadSpeed(uploadSize, pingSize);
      setUpload(uploadInfoData.speed);
      setDownload(downloadInfoData);
      setPing(uploadInfoData.ping);
      if(type === 'comfort'){
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
      
    }
    fetchData();
  }, []);

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
