function getListNames() {
    // Sending UPC data to server
    //console.log(result);
    var HTTP = new XMLHttpRequest();
    var URL = 'http://locahost:3000/getListNames';
    //var data = JSON.stringify(result);

    HTTP.open('GET', URL);
    HTTP.setRequestHeader('Content-type', 'application/json');
    HTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(HTTP.responseText);
        }
    };
    HTTP.send({})
}

function displayListNames(users){
    var listName = document.getElementById("listNames");
    users.forEach((user, index) => {
        var listLI = document.createElement("div");
        var content = `<ons-list-item tappable onclick='showList(${JSON.stringify(user)})' >`+
                    `${user.name}`+
                    //`<span class="list-item__subtitle">${user.location}</span>`+ //CAMBIO
                    `<ons-list-item/>`
        listLI.innerHTML = content
        listName.appendChild(listLI)
    });
}

async function showList(user){
    console.log(user)
    await localStorage.setItem("List", JSON.stringify(user))
    window.location.href = "listProv.html"
}

window.onload = function(){
    getLists()
}

async function getLists(){
    var user="luiscastro"
    await makeQuery(user)
    .then((lists)=>{
        displayListNames(lists)
    })
    .catch((error)=>{
        console.log(error)
    })
}

function makeQuery(user){
    return query(`http://localhost:3000/getListNames/${user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }, 20000)
    .then((response)=>{
        return Promise.resolve(response)
    })
}

function query(url, options, time) {
    // performs api calls sending the required authentication headers
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    let timeout = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Verifica tu conexión a internet')),
         time? time:15000);
    })
    return Promise.race([fetch(url, {
        headers,
        ...options
    }), timeout])
    .then(response => response.json())
    .then((response) => {
        if(response){
            if (response.error) throw new Error(response.error);
        }
        return Promise.resolve(response)
    })
    .catch((error) => {
        throw error
    })
}
