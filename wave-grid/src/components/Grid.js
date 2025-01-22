import React, { useState, useEffect, useCallback } from "react";
import "../Grid.css";

const GRADIENT_SIZE = 6; 

const Grid = ({ setAppBackground }) => {
  const [rows, setRows] = useState(15); 
  const [cols, setCols] = useState(20); 
  const [grid, setGrid] = useState([]);
  const [waveStart, setWaveStart] = useState(0);
  const [direction, setDirection] = useState(1); 
  const [baseHue, setBaseHue] = useState(0);

  
  useEffect(() => {
    const newGrid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("#000000")); 
    setGrid(newGrid);
  }, [rows, cols]);

  
  const generateGradientColors = (hue, reverse = false) => {
    const lightnessValues = [85, 70, 55, 40, 25, 15]; 
    const adjustedValues = reverse ? lightnessValues.reverse() : lightnessValues;
    return adjustedValues.map((lightness) => `hsl(${hue}, 100%, ${lightness}%)`);
  };

  
  const updateWave = useCallback(() => {
    const gradientColors = generateGradientColors(baseHue, direction === -1); 
    setGrid(() => {
      const newGrid = Array(rows).fill(null).map((_, rowIndex) =>
        Array(cols)
          .fill("#000000") 
          .map((_, colIndex) => {
            const wavePos = (colIndex - waveStart + cols) % cols;
            if (wavePos >= 0 && wavePos < GRADIENT_SIZE) {
              return gradientColors[wavePos]; 
            }
            return "#000000"; 
          })
      );
      return newGrid;
    });


    const middleColor = gradientColors[Math.floor(GRADIENT_SIZE / 2)];
    setAppBackground(middleColor);

    
    setWaveStart((prevStart) => {
      const newStart = prevStart + direction;
      if (newStart < 0 || newStart >= cols - 5) {
        setDirection(-direction); 
        setBaseHue((prevHue) => (prevHue + 3) % 360); 
        return prevStart;
      }
      return newStart;
    });
  }, [waveStart, direction, baseHue, rows, cols, setAppBackground]);

  
  useEffect(() => {
    const interval = setInterval(updateWave, 100); 
    return () => clearInterval(interval);
  }, [updateWave]);

  
  const handleRowChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setRows(value);
  };

  const handleColChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setCols(value);
  };

  return (
    <div className="grid-input">
      <div className="controls">
        <label>
          Rows:
          <input type="number" value={rows} onChange={handleRowChange} min="1" />
        </label>
        <label>
          Columns:
          <input type="number" value={cols} onChange={handleColChange} min="1" />
        </label>
      </div>
      <div className="out-box">
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cellColor, colIndex) => (
                <div
                  key={colIndex}
                  className="cell"
                  style={{ backgroundColor: cellColor }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
