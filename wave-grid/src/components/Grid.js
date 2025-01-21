import React, { useState, useEffect, useCallback } from "react";
import "../Grid.css";

const GRADIENT_SIZE = 6; // Number of columns in the gradient

const Grid = ({ setAppBackground }) => {
  const [rows, setRows] = useState(15); // Default rows
  const [cols, setCols] = useState(20); // Default columns
  const [grid, setGrid] = useState([]);
  const [waveStart, setWaveStart] = useState(0); // Start column of the wave
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [baseHue, setBaseHue] = useState(0); // Base hue value for the gradient

  // Create initial grid based on rows and columns
  useEffect(() => {
    const newGrid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("#000000")); // Default black grid
    setGrid(newGrid);
  }, [rows, cols]);

  // Function to generate gradient colors with light-to-dark or dark-to-light pattern
  const generateGradientColors = (hue, reverse = false) => {
    const lightnessValues = [85, 70, 55, 40, 25, 15]; // Light to dark
    const adjustedValues = reverse ? lightnessValues.reverse() : lightnessValues;
    return adjustedValues.map((lightness) => `hsl(${hue}, 100%, ${lightness}%)`);
  };

  // Function to update the wave pattern
  const updateWave = useCallback(() => {
    const gradientColors = generateGradientColors(baseHue, direction === -1); // Reverse pattern for backward movement
    setGrid(() => {
      const newGrid = Array(rows).fill(null).map((_, rowIndex) =>
        Array(cols)
          .fill("#000000") // Default black color
          .map((_, colIndex) => {
            const wavePos = (colIndex - waveStart + cols) % cols;
            if (wavePos >= 0 && wavePos < GRADIENT_SIZE) {
              return gradientColors[wavePos]; // Apply gradient pattern
            }
            return "#000000"; // Black for cells outside the gradient
          })
      );
      return newGrid;
    });


    const middleColor = gradientColors[Math.floor(GRADIENT_SIZE / 2)];
    setAppBackground(middleColor);

    // Update the wave start position
    setWaveStart((prevStart) => {
      const newStart = prevStart + direction;
      if (newStart < 0 || newStart >= cols - 5) {
        setDirection(-direction); // Reverse direction
        setBaseHue((prevHue) => (prevHue + 3) % 360); // Adjust hue incrementally
        return prevStart;
      }
      return newStart;
    });
  }, [waveStart, direction, baseHue, rows, cols, setAppBackground]);

  // Set up the animation interval
  useEffect(() => {
    const interval = setInterval(updateWave, 100); // Update every 200ms
    return () => clearInterval(interval);
  }, [updateWave]);

  // Handle row and column updates from user
  const handleRowChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setRows(value);
  };

  const handleColChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setCols(value);
  };

  return (
    <div>
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
