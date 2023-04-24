import React, {useState, useEffect, useContext} from 'react'
import { Context } from '../..';


const CheckConnection = () => {
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const {store} = useContext(Context);

    function handleCheckConnection(){
        store.getNetworkDownloadSpeed()
    }
  return (
    <div>
        <button onClick={handleCheckConnection()}>
            Connection
        </button>
    </div>
  )
}

export default CheckConnection;