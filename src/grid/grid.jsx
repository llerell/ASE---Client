import './grid.css'
import { changePixel } from '../api/fetch.js'

export function Grid({grid, isLoading, color}){
    if (grid.size === 0 || isLoading    ) {
        return <div className="grid-empty">Loading ...</div>
    }

    return(
        <div className="grid-container">
            {grid && [...grid.entries()].map(([key, pixel]) => (
                <div 
                    key={key} 
                    className="pixel"
                    style={{
                        backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`
                    }} 
                    onClick={()=>changePixel(pixel.x, pixel.y, color.r, color.g, color.b)}
                />
            ))}
        </div>
    )
}