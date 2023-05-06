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
import IpHistory from "./ip/components/IpHistory";
import Header from "./ip/components/Header";

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
    setFixedCanvasWidth(size.width * 0.8);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let max = Math.max(...store.ConnectionArray.map((item) => item[speedType]));
    let scale = (canvas.height - 40) / max;

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.strokeStyle = "rgba(75, 192, 192, 0.6)";
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    for (let i = 200; i <= max; i += 200) {
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
        ctx.moveTo(xPos, canvas.height - height);
      } else {
        ctx.lineTo(xPos, canvas.height - height);
      }
    });

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
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.fillText(
        item[speedType] + " мб/с",
        xPos - 10,
        canvas.height - height - 10
      );
    });
  }, [store.ConnectionArray, speedType, fixedCanvasWidth]);

  const bestResultIndex = store.ConnectionArray.reduce(
    (maxIndex, item, index, array) => {
      return item.downloadSpeed > array[maxIndex].downloadSpeed
        ? index
        : maxIndex;
    },
    0
  );
  const bestResult = store.ConnectionArray[bestResultIndex];

  const averageDownloadSpeed =
    store.ConnectionArray.reduce(
      (total, item) => total + item.downloadSpeed,
      0
    ) / store.ConnectionArray.length;
  console.log(averageDownloadSpeed);
  const closestToAverageIndex = store.ConnectionArray.reduce(
    (closestIndex, item, index, array) => {
      return Math.abs(item.downloadSpeed - averageDownloadSpeed) <
        Math.abs(array[closestIndex].downloadSpeed - averageDownloadSpeed)
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
        setPointPosition({ x: x + rect.left, y: y + rect.top });
      } else {
        setActivePoint(null);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <Header email={store.user.email} />
        <h2 className={styles.profileInfo}>Это ваш профиль</h2>
        <Histogram
          handleMouseMove={handleMouseMove}
          canvasRef={canvasRef}
          fixedCanvasWidth={fixedCanvasWidth}
        />
        <SpeedResults bestResult={bestResult} averageResult={averageResult} />
        {activePoint && (
          <ActivePointInfo point={activePoint} position={pointPosition} />
        )}
        <hr style={{ margin: "50px 0" }} />
        <IpHistory IpArray={store.IpArray} />
      </div>
    </div>
  );
};

export default observer(ProfilePage);
