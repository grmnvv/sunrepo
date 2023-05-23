import React, { useState } from 'react';
import styles from '../ip/components/components.module.css';

const DropdownButton = ({ onSelectFormat }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (format) => {
    onSelectFormat(format);
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menu} onClick={handleClick}>
      <p>Скачать отчет</p>
      {isOpen && (
        <div className={styles.dropdownReport}>
          <button className={styles.dropdownItem} onClick={() => handleSelect('json')}>
            JSON
          </button>
          <button className={styles.dropdownItem} onClick={() => handleSelect('csv')}>
            CSV
          </button>
          <button className={styles.dropdownItem} onClick={() => handleSelect('excel')}>
            Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
