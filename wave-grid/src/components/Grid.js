import React, { useState, useEffect, useCallback } from "react";
import "../Grid.css";

const ROWS = 15;
const COLS = 20;
const GRADIENT_SIZE = 6; // Number of columns in the gradient

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [waveStart, setWaveStart] = useState(0); // Start column of the wave
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [baseHue, setBaseHue] = useState(0); // Base hue value for the gradient

  // Create initial grid
  useEffect(() => {
    const newGrid = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill("#000000")); // Default black grid
    setGrid(newGrid);
  }, []);

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
      const newGrid = Array(ROWS).fill(null).map((_, rowIndex) =>
        Array(COLS)
          .fill("#000000") // Default black color
          .map((_, colIndex) => {
            const wavePos = (colIndex - waveStart + COLS) % COLS;
            if (wavePos >= 0 && wavePos < GRADIENT_SIZE) {
              return gradientColors[wavePos]; // Apply gradient pattern
            }
            return "#000000"; // Black for cells outside the gradient
          })
      );
      return newGrid;
    });

    // Update the wave start position
    setWaveStart((prevStart) => {
      const newStart = prevStart + direction;
      if (newStart < 0 || newStart >= COLS - 5) {
        setDirection(-direction); // Reverse direction
        setBaseHue((prevHue) => (prevHue + 2) % 360); // Adjust hue incrementally
        return prevStart;
      }
      return newStart;
    });
  }, [waveStart, direction, baseHue]);

  // Set up the animation interval
  useEffect(() => {
    const interval = setInterval(updateWave, 100); // Update every 200ms
    return () => clearInterval(interval);
  }, [updateWave]);

  return (
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
  );
};

export default Grid;
