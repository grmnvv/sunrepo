import React, { useState, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import styles from "./IpDetails.module.css"; 


const IpDetails = ({IpArray,id}) => {
  console.log(IpArray)
  console.log(id)
  const ipDetails = IpArray.find(item => item._id === id);
  const [select, setSelect] = useState(false)

  return ipDetails ? (
    <div className={styles.container}>
      <p>IP: {ipDetails.ipAddress}</p>
      <p>City: {ipDetails.city}</p>
      <button onClick={() => select ? setSelect(false) : setSelect(true)}>Show more</button>
      {ipDetails.latitude && ipDetails.longitude && select &&(
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
