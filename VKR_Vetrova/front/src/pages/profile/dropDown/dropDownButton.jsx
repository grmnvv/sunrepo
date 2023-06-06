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
      <p className={styles.downloadBtn}>cкачать отчет</p>
      {isOpen && (
        <div className={styles.dropdownReport}>
          <button className={styles.dropdownItem} onClick={() => handleSelect('json')}>
            json
          </button>
          <button className={styles.dropdownItem} onClick={() => handleSelect('csv')}>
            csv
          </button>
          <button className={styles.dropdownItem} onClick={() => handleSelect('excel')}>
            excel
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
