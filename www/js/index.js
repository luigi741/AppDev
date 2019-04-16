//===============================================================================================
// index.js
// This holds the main JavaScript for the Application
// By: Luis Castro
//===============================================================================================

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), function() {
            console.log('Device ready.');
        });
    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// Function to login into the application
function login() {
    let userEmail = document.getElementById('username').value;
    let userPswd = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPswd).then(user => {
        // Transfer to index.html upon successful login
        window.location = 'index.html';
    }).catch(error => {
        // Catch errors here
        var errorCode = error.code;
        var errorMessage = error.message;

        // Prompt user with error message
        window.alert("Error: " + errorMessage);
    });
};

// Function to signout of the applicaiton
function logout() {
    firebase.auth().signOut()
    window.location.href = "login.html"
};

function scan() {
    cordova.plugins.barcodeScanner.scan(
        function(result) { // result is the JSON object that holds barcode data
            if (result.cancelled) {
                console.log('Scan cancelled.');
            }
            else {
                showAlert();
                document.getElementById('upcInput').value = result.text;
            }
        },
        function(error) {
            alert("Scanning failed: " + error);
        }
    );
}

function showPop(target) {
    document.getElementById('confirmPop').show(target);
}

function hidePop() {
    document.getElementById('confirmPop').hide();
}

function showAlert() {
    // var dialog = document.getElementById('confirmAlert');
    // dialog.style = '';
    document.getElementById('confirmAlert').show();
}

function hideAlert() {
    document.getElementById('confirmAlert').hide();
}

// Add item to scan list
var listToSave = {};
var itemsList = [];
var insertCount = 0;
function addItem() {
    var check = false;
    var index = -1;
    var upc = document.getElementById('upcInput').value;
    var qty = document.getElementById('qtyInput').value;

    // Loop through array to see if any UPCs are already in list
    for (var i = 0; i < itemsList.length; i++) {
        if (itemsList[i].UPC == upc) {
            check = true;
            index = i;
            break;
        }
    }

    // If UPC is already in the list just add qty, else add it into list
    if (check) {
        // Need to convert strings to int
        if (itemsList != undefined || itemsList.length == 0) {
            var qtyCurrent = Number(itemsList[index].QTY);
            var qtyNew = Number(qty);
            var qtyTotal = qtyCurrent + qtyNew;
        }
        itemsList[index].QTY = qtyTotal.toString();

        // Change quantity of item already on scan list
        if (index >= 0) {
            document.getElementById('scanQuantity').children[index].children[0].innerHTML = qtyTotal;
        }
    }
    else {
        var scanList = document.getElementById('scanList');
        var scanQty = document.getElementById('scanQuantity');
        var listDel = document.getElementById('listDeleteIcon');

        var listNode = document.createElement('li');
        var listLI =
            '<div class="list-item__center list-item--nodivider__center">' +
                upc +
            '</div>';
        listNode.className = 'list-item list-item--nodivider'
        listNode.innerHTML = listLI;

        var qtyNode = document.createElement('li');
        var qtyLI =
            '<div class="list-item__right list-item--nodivider__right">' +
                qty +
            '</div>';
        qtyNode.className = 'list-item list-item--nodivider';
        qtyNode.innerHTML = qtyLI;

        var iconNode = document.createElement('li');
        var iconDel =
            '<div class="list-item__right list-item--nodivider__right">' +
                '<ons-icon icon="fa-trash-alt" style="color: red; font-size: 20px" onclick="alert()">' +
                '</ons-icon>' +
            '</div>';
        iconNode.className = 'list-item list-item--nodivider';
        iconNode.innerHTML = iconDel;

        scanList.appendChild(listNode);
        scanQty.appendChild(qtyNode);
        listDel.appendChild(iconNode);

        var itemToPush = {
            UPC: upc,
            QTY: qty
        };
        itemsList.push(itemToPush);
    }
    hideAlert();
    clearAlertForm();
}

var list = {};
function saveList() {
    var itemArr = itemsList;
    var crDate = new Date();

    // Get list name, location, and items
    list.name           = document.getElementById('listName').value;
    list.location       = document.getElementById('location').value;
    list.items          = itemArr;
    list.creationDate   = crDate.toISOString();
    list.user           = 'luiscastro';
    console.log('item:\n' + JSON.stringify(list, null, 4));

    if (list.name == '' || list.location == '') {
        alert('Please fill out list name and location');
    }
    else if (list.items.length == 0) {
        alert('Please add items to scan list before saving');
    }
    else {
        // HTTP 'POST' request to MongoDB server
        var xHTTP = new XMLHttpRequest();
        var xURL = 'http://54.198.236.52:3000/upcScan';
        var data = JSON.stringify(list);

        xHTTP.open('POST', xURL);
        xHTTP.setRequestHeader('Content-type', 'application/json');
        xHTTP.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xHTTP.responseText);
            }
        };
        xHTTP.send(data);
        clearForm();
        clearListObj();
        clearScanList();
    }
}

function clearListObj() {
    // Clear objects and arrays storing JSON data that was sent to DB
    list = {};
    listToSave = {};
    itemsList = [];
    insertCount = 0;
}

function clearScanList() {
    var scanNode = document.getElementById('scanList');
    while (scanNode.firstChild) {
        scanNode.removeChild(scanNode.firstChild);
    }

    var qtyNode = document.getElementById('scanQuantity');
    while (qtyNode.firstChild) {
        qtyNode.removeChild(qtyNode.firstChild);
    }

    var deleteNode = document.getElementById('listDeleteIcon');
    while (deleteNode.firstChild) {
        deleteNode.removeChild(deleteNode.firstChild);
    }
}

// Clear scan confirm alert
function clearAlertForm() {
    var qty = document.getElementById('qtyInput');
    var upc = document.getElementById('upcInput');
    qty.value = '';
    upc.value = '';
}

function clearForm() {
    document.getElementById('listName').value = '';
    document.getElementById('location').value = '';
}

function clearDialog() {
    var name = document.getElementById('dName');
    name.parentNode.removeChild(name);

    var location = document.getElementById('dLocation');
    location.parentNode.removeChild(location);
}

function dialogClose() {
    document.getElementById('dialog-1').hide();
}

function invPage() {
    var canvas = document.getElementById('canvas');
    canvas.style = '';

    // var home = document.getElementById('homeScreen');
    // home.style = 'visibility: hidden';
}

function homePage() {
    var home = document.getElementById('canvas');
    canvas.style = 'visibility: hidden';

    // var homeScreen = document.getElementById('homeScreen');
    // homeScreen.style = '';
}

app.initialize();
