import React, {useState, useContext, useEffect} from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../..'

const Connection = () => {
    const {store} = useContext(Context)
    useEffect(() => {
        store.getInfoConnection()
    }, []);
  return (
    <div>

    </div>
  )
}

export default observer(Connection)