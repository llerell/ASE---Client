function debugPixelOrder(jsonArray, label = "Pixel Order") {
    console.log(`--- ${label} ---`);
    
    const tableData = jsonArray.map((item, index) => {
        return {
            arrayIndex: index,
            pixelId: item?.id,
            x: item?.x,
            y: item?.y,
            color: `rgb(${item?.r}, ${item?.g}, ${item?.b})`
        };
    });

    console.table(tableData); 
}

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
                debugPixelOrder(json, "Incoming Update Array");
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
    if (x === undefined || y ===undefined) {
        console.error("No pixel selected!");
    }
    const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
    const url = new URL("update", baseUrl).href;

    fetch(url, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ x, y, r, g, b})
    })
    .catch(err => console.error("Update failed: ", err))
}

export function updateGrid(setGrid, lastUpdate){
    const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
    const url = new URL(`pixels/updateFrom/${lastUpdate}`, baseUrl).href;

    fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json.length === 0) return;
        
        setGrid(prevGrid => {
            const newGrid = new Map(prevGrid);
            json.forEach(item => {
                if (!item.pixel) {
                    console.warn("Received item without 'pixel' property:", item);
                    return;
                }
                console.log(item);
                const { x, y, r, g, b } = item.pixel;
                newGrid.set(`${x}, ${y}`, item.pixel);
            });
            return newGrid;
        });
    })
    .catch(err => console.error("Update failed: ", err));
}
            

export async function getLastUpdateTime(){
        try{
        const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
        const url = new URL("pixels/lastUpdateTime", baseUrl).href;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        return json.lastUpdateTime || 0;
    } catch (e) {
        console.error("Unexpected error in getLastUpdateTime:", e);
        return 0;
    }
}