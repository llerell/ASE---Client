        export function getCharacters() {
            fetch(process.env.PIXELWAR_API_URL + "characters")
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
            fetch(process.env.PIXELWAR_API_URL + "addCharacter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstname: ""+firstname,
                    lastname: ""+lastname,
                    universe:""+universe
                })
            })
        }

export function getGrid(){
    fetch(process.env.PIXELWAR_API_URL + "characters")
        .then(function (response) {
            return response.text();
        }).then(function (json) {
    });
}