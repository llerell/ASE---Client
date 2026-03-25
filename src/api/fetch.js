/**
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
**/

function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Authorization": "Bearer " + token
        }
    });
}

export function getGrid(setGrid){
    const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
    const url = new URL("pixels", baseUrl).href;

    authFetch(url)
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
}

export function changePixel(x, y, r, g, b){
    if (x === undefined || y === undefined) {
        console.error("No pixel selected!");
        return;
    }

    const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
    const url = new URL("update", baseUrl).href;

    authFetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ x, y, r, g, b })
    })
    .catch(err => console.error("Update failed: ", err));
}

export function updateGrid(setGrid, lastUpdate){
    const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
    const url = new URL(`pixels/updateFrom/${lastUpdate}`, baseUrl).href;

    authFetch(url)
    .then(res => res.json())
    .then(json => {
        if (!Array.isArray(json) || json.length === 0) return;

        setGrid(prevGrid => {
            const newGrid = new Map(prevGrid);
            let hasUpdates = false;

            json.forEach(item => {
                if (!item.pixel) return;
                hasUpdates = true;
                const { x, y } = item.pixel;
                newGrid.set(`${x},${y}`, item.pixel);
            });

            return hasUpdates ? newGrid : prevGrid;
        });
    })
    .catch(err => console.error("Update failed: ", err));
}
            

export async function getLastUpdateTime(){
    try{
        const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
        const url = `${baseUrl.replace(/\/$/, "")}/pixels/lastUpdateTime`;

        const response = await authFetch(url);

        if (!response.ok) {
            return 0;
        }

        const text = await response.text();
        return parseInt(text.trim(), 10) || 0;

    } catch (e) {
        console.error("Error in getLastUpdateTime:", e);
        return 0;
    }
}