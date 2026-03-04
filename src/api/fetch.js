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