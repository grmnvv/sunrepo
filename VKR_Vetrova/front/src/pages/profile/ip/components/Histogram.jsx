import styles from './components.module.css';
import React from 'react';
import { observer } from 'mobx-react-lite';

const Histogram = ({ handleMouseMove, canvasRef, fixedCanvasWidth }) => {
  return (
    <div className={styles.histogram}>
      <canvas
        ref={canvasRef}
        width={fixedCanvasWidth}
        height={300}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
};

export default observer(Histogram)
