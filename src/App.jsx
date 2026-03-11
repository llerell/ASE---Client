import { useState, useEffect } from 'react'
import './App.css'
import { getGrid, updateGrid, changePixel } from './api/fetch.js' // Combined imports
import { Grid } from './grid/grid.jsx'

function App() {
  const [grid, setGrid] = useState(new Map());
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // 1. Added error state!

  useEffect(() => { 
      function fetchGrid() {
        setIsLoading(true);
        setError(null); // Reset errors on new fetch
        
        try {
          // Note: To make setIsLoading(false) wait for this to finish, 
          // getGrid in fetch.js needs to `return fetch(...)` so it returns a Promise.
          getGrid(setGrid);
          console.log("Successfully triggered initial data load");
        } catch (err) {
          setError("Error loading data: " + err.message);
          console.log("Error loading data: " + err.message);
        } finally { 
          // This currently runs immediately. 
          setIsLoading(false);
        }
      }

      function refreshGrid() {
        try {
          updateGrid(setGrid);
          console.log("Successfully triggered data refresh");
        }
        catch (err) {
          console.log("Error refreshing data: " + err.message);
        }
      }

      fetchGrid();
      
      // Rafraîchit toutes les 5 secondes
      const intervalId = setInterval(refreshGrid, 5000); 

      // Cleanup function to stop the interval when the component unmounts
      return () => clearInterval(intervalId);
  }, []); 

  return (
    <>
      <h1>Pixel War</h1>
      
      {/* Display errors if they occur */}
      {error && <div style={{color: 'red'}}>{error}</div>} 

      <Grid 
        grid={grid}
        setSelectedPixel={setSelectedPixel}
        isLoading={isLoading}
      />
      <div>X: {selectedPixel?.x || 0}</div>
      <div>Y: {selectedPixel?.y || 0}</div>
      
      <input type="number" placeholder="R" id="r-input" min="0" max="255" value={r} onChange={(e) => setR(parseInt(e.target.value) || 0)}/>
      <input type="number" placeholder="G" id="g-input" min="0" max="255" value={g} onChange={(e) => setG(parseInt(e.target.value) || 0)}/>
      <input type="number" placeholder="B" id="b-input" min="0" max="255" value={b} onChange={(e) => setB(parseInt(e.target.value) || 0)}/>
      
      <button onClick={() => changePixel(selectedPixel?.x, selectedPixel?.y, r, g, b)}>
        Change Pixel
      </button>
    </>
  )
}

export default App