import { useState, useEffect, useRef } from 'react'
import './App.css'
import { getGrid, updateGrid, changePixel, getLastUpdateTime } from './api/fetch.js'
import { Grid } from './grid/grid.jsx'
import { TransformWrapper,TransformComponent } from 'react-zoom-pan-pinch'

const initialGrid = new Map();
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const key = `${j},${i}`;
    initialGrid.set(key, { x: j, y: i, r: 255, g: 255, b: 255 });
    }
}

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);  
  const lastUpdateRef = useRef(lastUpdate);

  useEffect(() => {
    lastUpdateRef.current = lastUpdate; 
  }, [lastUpdate])

  useEffect(() => { 
      async function init() {
        setIsLoading(true);
        setError(null); 
        
        try {
          getGrid(setGrid);
          console.log("Successfully triggered initial data load");
        } catch (err) {
          setError("Error loading data: " + err.message);
          console.log("Error loading data: " + err.message);
        } finally {
          setIsLoading(false);
          const time = await getLastUpdateTime();
          setLastUpdate(time);
        }
      }

      async function refreshGrid() {
        try {
          updateGrid(setGrid, lastUpdateRef.current);
          console.log("Successfully triggered data refresh");

          const time = await getLastUpdateTime();
          setLastUpdate(time);
        }
        catch (err) {
          console.log("Error refreshing data: " + err.message);
        }
      }

      init();
      
      // Rafraîchit toutes les 5 secondes
      const intervalId = setInterval(refreshGrid, 5000); 

      // Cleanup function to stop the interval when the component unmounts
      return () => clearInterval(intervalId);
  }, []); 

  return (
    <>
      <h1>Pixel War</h1>
      
      {/* Afficher éventuelles erreurs */}
      {error && <div style={{color: 'red'}}>{error}</div>} 
      <div className="grid-viewport">
        {/* This wrapper handles all the complex math for mouse wheel zooming and dragging! */}
        <TransformWrapper 
            initialScale={1} 
            minScale={0.5} 
            maxScale={20} /* How far in they can zoom */
            centerOnInit={true}
            limitToBounds={false}
            disabled={isLoading}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}  
            contentStyle={{ width: '1000px', height: '1000px' }}
          >
            <Grid 
              grid={grid}
              isLoading={isLoading}
              color={{r, g, b}}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      
      <input type="number" placeholder="R" id="r-input" min="0" max="255" value={r} onChange={(e) => setR(parseInt(e.target.value) || 0)}/>
      <input type="number" placeholder="G" id="g-input" min="0" max="255" value={g} onChange={(e) => setG(parseInt(e.target.value) || 0)}/>
      <input type="number" placeholder="B" id="b-input" min="0" max="255" value={b} onChange={(e) => setB(parseInt(e.target.value) || 0)}/>

    </>
  )
}

export default App