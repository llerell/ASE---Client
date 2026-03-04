import './grid.css'

export function Grid({grid, setSelectedPixel, isLoading}){
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
                    onClick={()=>setSelectedPixel(pixel)}
                />
            ))}
        </div>
    )
}