import { useState } from 'react'

export function Grid({grid}){
    // grid was fetched prior
    return(
    <>
        {grid && grid.map((row, index) => (
            <div key={index}>{
                row.map((cell, cellIndex) => (
                    <span key={index + "-" + cellIndex} style={{backgroundColor: cell.color}}>{cell}</span>
                ))
            }</div>
        ))}
    </>
    )
}