import React, { useState, useEffect, useContext } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import SpeedTest from "../speedTest/speedTest";
import BasicTest from "../basicTest/basicTest";

const ComfortTest = () => {
  const { store } = useContext(Context);
  const [downloadSize, setDownloadSize] = useState("");
  const [uploadSize, setUploadSize] = useState("");
  const [pingSize, setPingSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [browser, setBrowser] = useState({
  });
  useEffect(() => {
    store.refresh();
    store.getSettings();
  }, []);
  useEffect(() => {
    setLoading(true);

    const settings = store.Settings;
    if (settings.ipSettings && settings.browserSettings) {
      setDownloadSize(settings.download);
      setUploadSize(settings.upload);
      setPingSize(settings.ping);
      console.log(settings.browserSettings)
      setBrowser(settings.browserSettings)
      console.log(browser)
    }

  }, [store.Settings]);


  useEffect(() => {
    console.log(browser)
  }, [browser]);

  return (
    <div>
      {(downloadSize || uploadSize || pingSize) && (
        <SpeedTest
          downloadSize={downloadSize}
          uploadSize={uploadSize}
          pingSize={pingSize}
          type={'comfort'}
        />
      )}
      <BasicTest />
      <h2>Информация о браузере и компьютере:</h2>
      <hr />
      {Object.entries(browser).map(([key, value]) => {
        if(value === true) {
          return <p>{navigator[key]}</p>
        }
        return null;
      })}
    </div>
  );
};

export default observer(ComfortTest);
