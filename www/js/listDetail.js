window.onload = function() {
    fillListInfo()
}

function editListDetails() {

    document.getElementById('confirmAlert').show();

    var listName = document.getElementById("listNameEdit")
    var lN = document.getElementById("listName")
    listName.placeholder = lN.innerText
    var location = document.getElementById("locationEdit")
    //location.placeholder
}

function hideAlert() {
    document.getElementById('confirmAlert').hide();
}

async function getUser(id) {
    await makeQuery(id)
        .then((list) => {
            console.log("from server", list)
        })
        .catch((error) => {
            console.log(error)
        })
}

async function fillListInfo() {
    console.log("in")
    var list = await localStorage.getItem("List")
    list = JSON.parse(list)
    console.log(list)
    var h2 = document.getElementById("listName")
    var text = document.createTextNode(`${list.name}`)
    h2.appendChild(text)

    var h2 = document.getElementById("locationInfo")
    var text = document.createTextNode(`LOCATION: ${list.location}`)
    h2.appendChild(text)

    list.items.forEach((element, index) => {

        var upc = element.UPC ? element.UPC : element.upc;
        var qty = element.QTY ? element.QTY : element.qty;

        var scanList = document.getElementById('scanList');
        var scanQty = document.getElementById('scanQuantity');
        var listDel = document.getElementById('listDeleteIcon');

        var listNode = document.createElement('li');
        var listLI =
            '<div class="list-item__center list-item--nodivider__center">' +
            `<span id="upc${index}">` +
            upc +
            `</span>` +
            '</div>';
        listNode.className = 'list-item list-item--nodivider'
        listNode.innerHTML = listLI;

        var qtyNode = document.createElement('li');
        var qtyLI =
            '<div class="list-item__right list-item--nodivider__right">' +
            `<ons-icon icon="md-minus-circle" style="margin-right: 5px" onclick="minus(${index})"></ons-icon>` +
            `<span id="item${index}">` +
            qty +
            `</span>` +
            `<ons-icon icon="md-plus-circle" style="margin-left: 5px" onclick="add(${index})"></ons-icon>` +
            '</div>';
        qtyNode.className = 'list-item list-item--nodivider';
        qtyNode.innerHTML = qtyLI;

        /* var iconNode = document.createElement('li');
        var iconDel =
            '<div class="list-item__right list-item--nodivider__right">' +
                //'<ons-icon icon="fa-add-circle-outline" style="color: red"></ons-icon>' +
                //`<ion-icon name="fa-add-circle-outline"></ion-icon>`+
                '<ons-icon icon="md-plus-circle"></ons-icon>'+
            '</div>';
        iconNode.className = 'list-item list-item--nodivider';
        iconNode.innerHTML = iconDel; */

        scanList.appendChild(listNode);
        scanQty.appendChild(qtyNode);
        //listDel.appendChild(iconNode);

    });
}

function minus(itemId) {
    console.log(itemId)
    var id = document.getElementById(`item${itemId}`)
    qty = parseInt(id.innerHTML)
    if (qty > 0) {
        var result = parseInt(qty - 1)
    } else {
        var result = 0
    }
    id.innerHTML = result
}

function add(itemId) {
    console.log(itemId)
    var id = document.getElementById(`item${itemId}`)
    qty = parseInt(id.innerHTML)
    var result = parseInt(qty + 1)
    id.innerHTML = result
}

async function updateItemsInfo() {
    var items = []
    var list = JSON.parse(localStorage.getItem("List"))
    var long = list.items.length
    for (var i = 0; i < long; i++) {
        var UPC = document.getElementById(`upc${i}`).innerHTML;
        var QTY = document.getElementById(`item${i}`).innerHTML;
        var body = {
            UPC,
            QTY
        }
        items.push(body)
    }
    await updateItems(items, list._id)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}

function makeQuery(id) {
    return query(`http://54.198.236.52:3000/getList?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }, 20000)
        .then((response) => {
            return Promise.resolve(response)
        })
}

async function updateListInfo() {
    var list = await localStorage.getItem("List")
    list = JSON.parse(list)
    console.log(list)
    var listName = document.getElementById("listNameEdit").value;
    var location = document.getElementById("locationEdit").value;
    var body = {
        name: listName,
        location,
        id: list._id
    }

    await updateListName(body)
        .then((response) => {
            document.getElementById("listName").innerHTML = listName
            document.getElementById("locationInfo").innerHTML = `Location: ${location}`
            document.getElementById('confirmAlert').hide();
            //window.location.href = "homePage.html"
        })
        .catch((error) => {
            console.log(error)
        })
}

function updateListName(body) {
    return query(`http://54.198.236.52:3000/updateListNames`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            return Promise.resolve(response)
        })
}

function updateItems(body, id) {
    return query(`http://localhost:3000/updateItems/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
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
            time ? time : 15000);
    })
    return Promise.race([fetch(url, {
            headers,
            ...options
        }), timeout])
        .then(response => response.json())
        .then((response) => {
            if (response) {
                if (response.error) throw new Error(response.error);
            }
            return Promise.resolve(response)
        })
        .catch((error) => {
            throw error
        })
}
