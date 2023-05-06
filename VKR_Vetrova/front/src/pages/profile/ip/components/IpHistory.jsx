import { Link } from 'react-router-dom';
import styles from './components.module.css';
import React from 'react';
import { observer } from 'mobx-react-lite';

const IpHistory = ({ IpArray }) => {
  return (
    <div>
      <h2 className={styles.ipHistoryTitle}>IP History</h2>
      <div className={styles.ipHistoryContainer}>
        {IpArray.map((item, index) => (
          <div key={index} className={styles.ipItem}>
            <p>IP: {item.ipAddress}</p>
            <p>Дата создания: {new Date(item.createdAt).toLocaleString()}</p>
            <Link to={`/profile/ip/${item._id}`}>Открыть подробнее</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(IpHistory);
