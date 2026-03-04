import { useState } from 'react'
import './App.css'
import { getGrid } from './api/fetch.js'
import { Grid } from './grid/grid.jsx'

function App() {
  const [grid, setGrid] = useState([]);
  return (
    <>
      <button onClick={() => getGrid(setGrid)}>Get grid</button>
      <Grid grid={grid} />
    </>
  )
}

export default App
