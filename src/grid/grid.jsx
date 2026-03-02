import { useState } from 'react'

export function Grid(){
    [grid, setGrid] = useState([[]]);
    setGrid([],[],[])
    // fetch Grid from backend
    return(
    <>
        {grid && grid.map((row, index) => (
            <div key={index}>{
                row.map((cell, cellIndex) => (
                    <span key={cellIndex} style={{backgroundColor: cell.color}}>{cell}</span>
                ))
            }</div>
        ))}
    </>
    )
}