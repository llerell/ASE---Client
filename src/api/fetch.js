export function getGrid(setGrid){
    try{
        const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
        const url = new URL("pixels", baseUrl).href;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(json => {
                const gridMap = new Map();
                json.forEach(pixel => {
                    gridMap.set(`${pixel.x},${pixel.y}`, pixel);
                });
                setGrid(gridMap);
            })
            .catch(error => {
                console.error("Error fetching grid data:", error);
            });
    } catch (e) {
        console.error("Unexpected error in getGrid:", e);
    }
}

export function changePixel(x, y, r, g, b){
    try{
        const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
        const url = new URL("update", baseUrl).href;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id : null,
                x: x,
                y: y,
                r: r,
                g: g,
                b: b
            })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(json => {
            console.log("Pixel updated successfully:", json);
        })
        .catch(error => {
            console.error("Error updating pixel:", error);
        });
    } catch (e) {
        console.error("Unexpected error in changePixel:", e);
    }
}

export function updateGrid(setGrid){
    try{
        const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
        const url = new URL("pixels/update", baseUrl).href;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                // Return the parsed JSON promise
                return response.json(); 
            })
            .then(json => {
                console.log("Data received from /pixels/update:", json); 
                
                json.forEach(item => {
                    // NOTE: If PixelRequest wraps the pixel inside a property called 'pixel', 
                    // you will need to change item.x to item.pixel.x, etc.
                    // Check your browser console to see the exact structure!
                    
                    const pX = item.pixel.x;
                    const pY = item.pixel.y;
                    const r = item.pixel.r;
                    const g = item.pixel.g;
                    const b = item.pixel.b;

                    console.log(`Updating pixel at (${pX}, ${pY}) with color rgb(${r}, ${g}, ${b})`);
                    
                    setGrid(prevGrid => {
                        const newGrid = new Map(prevGrid);
                        newGrid.set(`${pX},${pY}`, item.pixel); 
                        return newGrid;
                    });
                });
            })
            .catch(error => {
                console.error("Error fetching updated grid data:", error);
            });
    } catch (e) {
        console.error("Unexpected error in updateGrid:", e);
    }
}