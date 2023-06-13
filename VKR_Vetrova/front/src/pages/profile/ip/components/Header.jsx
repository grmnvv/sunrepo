import React, { useState } from 'react';
import styles from './components.module.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../../..';

const Header = ({ email, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { store } = useContext(Context);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    store.logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleTest = () => {
    navigate('/');
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };
  const handleProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  }
  return (
    <div className={styles.header} style={style}>
      <h1 className={styles.logo} onClick={() => {navigate('/')}}>connectly</h1>

      {email ? <div className={styles.menu} onClick={handleClick}>
        <p>{email}</p>
        {isOpen && (
          <div className={styles.dropdown}>
                        <button className={styles.dropdownItem} onClick={handleProfile}>
              Профиль
            </button>
            <button className={styles.dropdownItem} onClick={handleTest}>
              Сделать тестирование
            </button>
            <button className={styles.dropdownItem} onClick={handleSettings}>
              Настройки
            </button>
            <button className={styles.dropdownItem} onClick={handleLogout}>
              Выход
            </button>
          </div>
        )}
      </div> : <button style={{fontSize:'18px'}} className={styles.button} onClick={() => {navigate('/login')}}>войти</button>}
    </div>
  );
};

export default Header;
