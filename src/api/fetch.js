/** 
export function getCharacters() {
    fetch(import.meta.env.PIXELWAR_API_URL + "characters")
        .then(function (response) {
            return response.text();
        }).then(function (json) {
            document.getElementById("include").innerHTML="";
            const list = document.getElementById("include");
            JSON.parse(json).forEach(person => {
                const li = document.createElement("li");
                li.textContent = `${person.firstname} ${person.lastname} from ${person.universe} (id: ${person.id})`;
                list.appendChild(li);
            });
        });
}

export function postAddCharacter(){
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const universe = document.getElementById("universe").value;
    fetch(import.meta.env.PIXELWAR_API_URL + "addCharacter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstname: ""+firstname,
            lastname: ""+lastname,
            universe: ""+universe
        })
    });
}
*/

export function getGrid({setGrid}){
    try{
        const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
        console.log("Base URL from environment variable:", baseUrl);
        const url = new URL("pixels", baseUrl).href;
        console.log("url:", url);
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(json => {
                console.log("Received grid data:", json);
                setGrid(json);
            })
            .catch(error => {
                console.error("Error fetching grid data:", error);
            });
    } catch (e) {
        console.error("Unexpected error in getGrid:", e);
    }
}