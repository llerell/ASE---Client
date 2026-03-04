import './grid.css'

export function Grid({grid}){
    if (grid.size === 0) {
        return <div className="grid-empty">Click "Get grid" to load pixels</div>
    }

    return(
        <div className="grid-container">
            {[...grid.entries()].map(([key, pixel]) => (
                <div 
                    key={key} 
                    className="pixel"
                    style={{
                        backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`
                    }} 
                    onClick={()=>console.log(`clicked pixel ${pixel.x}, ${pixel.y}`)}
                />
            ))}
        </div>
    )
}