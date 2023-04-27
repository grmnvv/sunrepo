import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import Ip from "./ip/ip";
import { Context } from "../..";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const canvasRef = useRef(null);
  const [speedType, setSpeedType] = useState("downloadSpeed");
  const [activePoint, setActivePoint] = useState(null); // State for the active point
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 }); // State for the position of the active point

  useEffect(() => {
    store.refresh();
    store.getInfoConnection();
    store.getInfoIp();
    console.log(store.ConnectionArray);
  }, []);

  const fixedCanvasWidth = window.innerWidth * 0.7; // Set your fixed width here

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let max = Math.max(
      ...store.ConnectionArray.map((item) => item[speedType]) // Use the dynamic speed type here
    );
    let scale = (canvas.height - 40) / max;

    // Draw horizontal lines and their labels
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

    // Draw line chart
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

    // Draw points and their labels
    store.ConnectionArray.forEach((item, index) => {
      let height = item[speedType] * scale; // Use the dynamic speed type here
      let xPos = index * pointDistance + 50; // Use pointDistance here again

      // Draw point
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.strokeStyle = "rgba(75, 192, 192, 1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xPos, canvas.height - height, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      // Draw label
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.fillText(
        item[speedType] + " мб/с", // Use the dynamic speed type here
        xPos - 10,
        canvas.height - height - 10
      );
    });
  }, [store.ConnectionArray, speedType]); // Add speedType to the dependency array

  let bestResult = Math.max(
    ...store.ConnectionArray.map((item) => item[speedType]) // Use the dynamic speed type here
  );
  let averageResult =
    store.ConnectionArray.reduce(
      (total, item) => total + item[speedType], // Use the dynamic speed type here
      0
    ) / store.ConnectionArray.length;

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
        // If the mouse is within 5 pixels of the point
        const time = new Date(point.createdAt);
        const updatedPoint = {
          ...point,
          createdAt: `${time.toLocaleDateString()} в ${time.toLocaleTimeString()}`,
        };
        setActivePoint(updatedPoint);
        setPointPosition({ x: x + rect.left, y: y + rect.top }); // Update the position of the active point
      } else {
        setActivePoint(null);
      }
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        onClick={() =>
          setSpeedType(
            speedType === "downloadSpeed" ? "uploadSpeed" : "downloadSpeed"
          )
        }
      >
        Switch to{" "}
        {speedType === "downloadSpeed" ? "Upload Speed" : "Download Speed"}
      </button>
      <div className={styles.histogramm} style={{ border: "1px solid black" }}>
        <canvas
          ref={canvasRef}
          width={fixedCanvasWidth}
          height={300}
          style={{ margin: "auto" }}
          onMouseMove={handleMouseMove}
        ></canvas>
      </div>
      <div>
        <p>Лучший результат: {bestResult}</p>
        <p>Средний результат: {averageResult.toFixed(2)}</p>
      </div>
      {activePoint && ( // If there is an active point, show a modal
        <div
          style={{
            position: "absolute",
            top: pointPosition.y - 60, // Show the modal right above the point
            left: pointPosition.x - 50, // Center the modal horizontally
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
            fontSize: "12px",
          }}
        >
          <p style={{ fontSize: "12px" }}>
            Дата измерения: {activePoint.createdAt}
          </p>
          <p style={{ fontSize: "12px" }}>
            Скорость скачивания: {activePoint.downloadSpeed} мб/с
          </p>
          <p style={{ fontSize: "12px" }}>
          Скорость загрузки: {activePoint.uploadSpeed} мб/с
          </p>
        </div>
      )}
    </div>
  );
};

export default observer(ProfilePage);
