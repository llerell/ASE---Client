import { useState, useEffect } from 'react'
import './App.css'
import { getGrid } from './api/fetch.js'
import { Grid } from './grid/grid.jsx'
import { changePixel } from './api/fetch.js'

function App() {
  const [grid, setGrid] = useState(new Map());
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { // Nécessaire pour se connecter un système externe
      async function fetchGrid() {
        try {

				  setIsLoading(true);
          getGrid(setGrid);
          console.log("Successfully loaded data");

        } catch (err) {
          setError("Error loading data: " + err.message);
				  console.log("Error loading data: " + err.message);

        } finally { // quel que soit le résultat
				setIsLoading(false);
			}
        }
        fetchGrid();

        const intervalId = setInterval(() => {
        fetchGrid();
      }, 5000);

      return () => clearInterval(intervalId);
    }, []); // [] pour que ça ne se lance qu'une fois au montage du composant

  return (
    <>
      <h1>Pixel War</h1>
      <Grid 
        grid={grid}
        setSelectedPixel={setSelectedPixel}
        isLoading={isLoading}
      />
      <div>{selectedPixel?.x || 0}:</div>
      <div>{selectedPixel?.y || 0}:</div>
      <input type="number" placeholder="0" id="r-input" min="0" max="255" value={r} onChange={(e) => setR(parseInt(e.target.value) || 0)}/>
      <input type="number" placeholder="0" id="g-input" min="0" max="255" value={g} onChange={(e) => setG(parseInt(e.target.value) || 0)}/>
      <input type="number" placeholder="0" id="b-input" min="0" max="255" value={b} onChange={(e) => setB(parseInt(e.target.value) || 0)}/>
      <button onClick={() => changePixel(selectedPixel?.x, selectedPixel?.y, r, g, b)}>Change Pixel</button>
    </>
  )
}

export default App
