import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import Ip from "./ip/ip";
import { Context } from "../..";
import { Link } from "react-router-dom";
import Histogram from "./ip/components/Histogram";
import SpeedResults from "./ip/components/SpeedResults";
import ActivePointInfo from "./ip/components/ActivePointInfo";
import IpHistoryDetails from "./ip/components/IpHistory";
import Header from "./ip/components/Header";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DropdownButton from "./dropDown/dropDownButton";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(windowSize);
  return windowSize;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const size = useWindowSize();
  const { store } = useContext(Context);
  const canvasRef = useRef(null);
  const [speedType, setSpeedType] = useState("downloadSpeed");
  const [activePoint, setActivePoint] = useState(null);
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [fixedCanvasWidth, setFixedCanvasWidth] = useState(size.width * 0.8);

  useEffect(() => {
    store.refresh();
    store.getInfoConnection();
    store.getInfoIp();
  }, []);

  useEffect(() => {
    setFixedCanvasWidth(size.width * 0.8);
  }, [size]);

  useEffect(() => {
    setFixedCanvasWidth(size.width * 0.75);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let max = Math.max(...store.ConnectionArray.map((item) => item[speedType]));
    let scale = (canvas.height - 40) / max;

    ctx.fillStyle = "rgba(66, 66, 66, 0.8)";
    ctx.strokeStyle = "rgba(122, 122, 122, 0.6)";
    ctx.lineWidth = 1;
    ctx.font = "12px 'Gill Sans Ru'";
    for (let i = 0; i <= max; i += 10) {
      let y = canvas.height - i * scale;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      ctx.fillText(i, 0, y);
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgba(75, 192, 192, 1)";
    ctx.lineWidth = 1;
    ctx.shadowColor = "rgba(75, 192, 192, 0.5)";
    ctx.shadowBlur = 5;

    const pointDistance = fixedCanvasWidth / store.ConnectionArray.length;

    store.ConnectionArray.forEach((item, index) => {
      let height = item[speedType] * scale;
      let xPos = index * pointDistance + 50;
      if (index === 0) {
        ctx.moveTo(xPos, canvas.height);
        ctx.lineTo(xPos, canvas.height - height);
      } else {
        ctx.lineTo(xPos, canvas.height - height);
      }
    });

    ctx.lineTo((store.ConnectionArray.length - 1) * pointDistance + 50, canvas.height);
    ctx.closePath(); // Закрываем форму
    ctx.fillStyle = "rgba(75, 192, 192, 0.2)"; // Задаем цвет заполнения
    ctx.fill(); // Заливаем область цветом
    ctx.stroke();
    ctx.shadowBlur = 0;



    store.ConnectionArray.forEach((item, index) => {
      let height = item[speedType] * scale;
      let xPos = index * pointDistance + 50;

      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.strokeStyle = "rgba(75, 192, 192, 1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xPos, canvas.height - height, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#343434";
      ctx.font = '12px "Gill Sans Ru"';
      ctx.fillText(
        item[speedType] + " мб/с",
        xPos - 10,
        canvas.height - height - 10
      );
    });
  }, [store.ConnectionArray, speedType, fixedCanvasWidth]);

  const toggleSpeedType = () => {
    setSpeedType((prevSpeedType) =>
      prevSpeedType === "downloadSpeed" ? "uploadSpeed" : "downloadSpeed"
    );
  };
  const handleFormatSelected = (format) => {
    handleDownload(format);
  };

  const bestResultIndex = store.ConnectionArray.reduce(
    (maxIndex, item, index, array) => {
      return item[speedType] > array[maxIndex][speedType]
        ? index
        : maxIndex;
    },
    0
  );
  const bestResult = store.ConnectionArray[bestResultIndex];

  const averageDownloadSpeed =
    store.ConnectionArray.reduce(
      (total, item) => total + item[speedType],
      0
    ) / store.ConnectionArray.length;
  console.log(averageDownloadSpeed);
  const closestToAverageIndex = store.ConnectionArray.reduce(
    (closestIndex, item, index, array) => {
      return Math.abs(item[speedType] - averageDownloadSpeed) <
        Math.abs(array[closestIndex][speedType] - averageDownloadSpeed)
        ? index
        : closestIndex;
    },
    0
  );
  const averageResult = store.ConnectionArray[closestToAverageIndex];

  const handleMouseMove = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pointDistance = fixedCanvasWidth / store.ConnectionArray.length;
    const index = Math.round((x - 50) / pointDistance);
    const point = store.ConnectionArray[index];
    if (point) {
      const height =
        point[speedType] *
        ((canvasRef.current.height - 40) /
          Math.max(...store.ConnectionArray.map((item) => item[speedType])));
      if (Math.abs(canvasRef.current.height - height - y) < 5) {
        const time = new Date(point.createdAt);
        const updatedPoint = {
          ...point,
          createdAt: `${time.toLocaleDateString()} в ${time.toLocaleTimeString()}`,
        };
        setActivePoint(updatedPoint);
        setPointPosition({ x: x + rect.left, y: y + rect.top + 70 });
      } else {
        setActivePoint(null);
      }
    }
  };

  const handleDownload = (format) => {
    // Удаление ненужных полей и преобразование createdAt
    const filterData = (data) =>
      data.map((item) => {
        const { __v, user, _id, ...rest } = item;
        rest.createdAt = new Date(rest.createdAt).toLocaleDateString();
        return rest;
      });

    switch (format) {
      case "json":
        const reportData = {
          connectionInfo: filterData(store.ConnectionArray),
          ipInfo: filterData(store.IpArray),
        };
        const json = JSON.stringify(reportData, null, 2);
        const blobJson = new Blob([json], { type: "text/plain;charset=utf-8" });
        saveAs(blobJson, "report.json");
        break;
      case "csv":
        const headersConnection = [
          "createdAt",
          "downloadSpeed",
          "uploadSpeed",
          "ping",
        ];
        const csvConnection = filterData(store.ConnectionArray)
          .map((row) =>
            headersConnection.map((header) => row[header]).join(",")
          )
          .join("\n");
        const headersIp = [
          "createdAt",
          "ipAddress",
          "city",
          "latitude",
          "longitude",
        ];
        const csvIp = filterData(store.IpArray)
          .map((row) => headersIp.map((header) => row[header]).join(","))
          .join("\n");
        const csv = `Connection Info:\n${headersConnection.join(
          ","
        )}\n${csvConnection}\n\nIP Info:\n${headersIp.join(",")}\n${csvIp}`;
        const blobCsv = new Blob([csv], { type: "text/plain;charset=utf-8" });
        saveAs(blobCsv, "report.csv");
        break;
      case "excel":
        const wsConnection = XLSX.utils.json_to_sheet(
          filterData(store.ConnectionArray)
        );
        const wsIp = XLSX.utils.json_to_sheet(filterData(store.IpArray));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsConnection, "Connection Info");
        XLSX.utils.book_append_sheet(wb, wsIp, "IP Info");
        XLSX.writeFile(wb, "report.xlsx");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Header email={store?.user.email} />
      <div className={styles.centered}>
        <div className={styles.profile}>Профиль</div>
        <div className={styles.blockGraphic}>
          <div className={styles.historyLabel}>История измерений {speedType == 'downloadSpeed' ? 'скорости скачивания' : 'скорости загрузки'}</div>
          <Histogram
            handleMouseMove={handleMouseMove}
            canvasRef={canvasRef}
            fixedCanvasWidth={fixedCanvasWidth}
            array={store.ConnectionArray.length ? store.ConnectionArray.length : -1}
          />
          <div className={styles.changeType}>
            <button className={styles.button} onClick={() => { toggleSpeedType() }}>{speedType == 'downloadSpeed' ? 'uploadSpeed' : 'downloadSpeed'}</button>
          </div>

          <SpeedResults bestResult={bestResult} averageResult={averageResult} />
          {activePoint && (
            <ActivePointInfo point={activePoint} position={pointPosition} />
          )}
          <div className={styles.buttonBlock}>
            <DropdownButton onSelectFormat={handleFormatSelected} />
          </div>
          <div className={styles.changeType}>
            <button style={{ fontSize: '16px', margin: '0 0 50px 0' }} className={styles.button} onClick={() => { store.deleteAll() }}>удалить историю тестирований</button>
          </div>
        </div>
        <IpHistoryDetails IpArray={store.IpArray} />

      </div>
    </>
  );
};

export default observer(ProfilePage);
