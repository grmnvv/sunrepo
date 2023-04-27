import { observer } from 'mobx-react-lite'
import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './profile.module.css'
import Ip from './ip/ip'
const ProfilePage = () => {
    const navigate = useNavigate();

  return (
    <div>
        <div className={styles.histogramm}>

        </div>
        <div>
            <Ip />
        </div>
    </div>
  )
}

export default observer(ProfilePage)