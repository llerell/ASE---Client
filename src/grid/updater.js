export function updatePixel(x, y , r, g, b, setGrid){
    setGrid(prevGrid => {
        const newGrid = new Map(prevGrid);
        newGrid.set(`${x},${y}`, {x, y, r, g, b});
        return newGrid;
    })
}