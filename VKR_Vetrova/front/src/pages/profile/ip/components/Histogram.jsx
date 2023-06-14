import styles from './components.module.css';
import React from 'react';
import { observer } from 'mobx-react-lite';

const Histogram = ({ handleMouseMove, canvasRef, fixedCanvasWidth, array }) => {
  return (
    <div className={styles.histogram}>
      <canvas
        ref={canvasRef}
        width={array > 0 ? fixedCanvasWidth : 0}
        height={array > 0 ? 300 : 0}
        onMouseMove={handleMouseMove}

      ></canvas>  
      {array < 0 && <div>данные об интернет соединениях отсутствуют</div>}
    </div>
  );
};

export default observer(Histogram)
