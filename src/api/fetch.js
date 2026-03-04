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
                id : 1,
                x: x,
                y: y,
                r: r,
                g: g,
                b: b,
                height: 1,
                width: 1
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