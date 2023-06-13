import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import styles from './components.module.css';

const IpHistoryDetails = ({ IpArray }) => {
  const [select, setSelect] = useState({});

  const toggleSelect = (id) => {
    setSelect(prevSelect => ({ ...prevSelect, [id]: !prevSelect[id] }));
  }

  return (
    <div className={styles.ipContainer}>
      <h2 className={styles.ipLabel}>IP History</h2>
      <div className={styles.ipBlock}>
        {IpArray.map((item, index) => {
          const ipDetails = IpArray.find(({ _id }) => _id === item._id);
          return (
            <div key={index} className={styles.ipInputs}>
              <p>Дата создания: {new Date(item.createdAt).toLocaleString()}</p>
              <p>IP: {ipDetails.ipAddress}</p>
              <p>City: {ipDetails.city}</p>
              <button style={{fontSize:'16px'}} className={styles.button} onClick={() => toggleSelect(item._id)}>показать карту</button>
              {ipDetails.latitude && ipDetails.longitude && select[item._id] && (
                <div className={styles.mapContainer}>
                  <YMaps query={{ apikey: "ddeefd86-2d2c-4bd1-a1ec-34b1e774b08c" }}>
                    <Map
                      defaultState={{
                        center: [ipDetails.latitude, ipDetails.longitude],
                        zoom: 10,
                      }}
                      width="600px"
                      height="300px"
                      options={{ suppressMapOpenBlock: true }}
                    >
                    </Map>
                  </YMaps>
                </div>
              )}
              <hr />
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default observer(IpHistoryDetails);
