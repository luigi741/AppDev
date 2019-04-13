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

function dialogShow() {
    // Get form values
    var item = {};
    item.name = document.getElementById('listName').value;
    item.location = document.getElementById('location').value;

    var list1 = document.createElement('P');
    list1.setAttribute('id', 'dName');
    list1.innerHTML = item.name;

    var list2 = document.createElement('P');
    list2.setAttribute('id', 'dLocation');
    list2.innerHTML = item.location;

    document.getElementById('dialogList').appendChild(list1);
    document.getElementById('dialogList').appendChild(list2);
    document.getElementById('dialog-1').show();

    // Sending object 'result' to server
    console.log(item);
    var HTTP = new XMLHttpRequest();
    var URL = 'http://54.198.236.52:3000/test';
    var data = JSON.stringify(item);

    HTTP.open('POST', URL);
    HTTP.setRequestHeader('Content-type', 'application/json');
    HTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(HTTP.responseText);
        }
    };
    HTTP.send(data);

    clearForm();
}

function scan() {
    cordova.plugins.barcodeScanner.scan(
        function(result) { // result is the JSON object that holds barcode data
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);

            // Sending UPC data to server
            console.log(result);
            var HTTP = new XMLHttpRequest();
            var URL = 'http://54.198.236.52:3000/upcScan';
            var data = JSON.stringify(result);

            HTTP.open('POST', URL);
            HTTP.setRequestHeader('Content-type', 'application/json');
            HTTP.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(HTTP.responseText);
                }
            };
            HTTP.send(data);

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
function addItem(callback) {
    var upc = document.getElementById('upcInput').value;
    var qty = document.getElementById('qtyInput').value;

    console.log(upc);
    console.log(qty);

    var scanList    = document.getElementById('scanList');
    var scanQty     = document.getElementById('scanQuantity');
    var listDel     = document.getElementById('listDeleteIcon');

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
            '<ons-icon icon="fa-trash-alt" style="color: red"></ons-icon>' +
        '</div>';
    iconNode.className = 'list-item list-item--nodivider';
    iconNode.innerHTML = iconDel;

    scanList.appendChild(listNode);
    scanQty.appendChild(qtyNode);
    listDel.appendChild(iconNode);

    // var scanListLI = document.createElement('li');
    // scanListLI.class = 'list-item list-item--nodivider';
    // scanList.appendChild(scanListLI);

    // addUPC();
    hideAlert();
    clearAlertForm();
}

function addUPC() {
    var upc = document.getElementById('upcInput').value;
    var scanListDiv = document.createElement('div');
    scanListDiv.class = 'list-item__right list-item--nodivider__right';
    scanListDiv.innerHTML = upc;

    var list = document.getElementById('scanListLI');

    if (list) {
        console.log(list);
    }
    else {
        console.log('Empty');
    }
    // list.appendChild(scanListDiv);
}

// Clear scan confirm alert
function clearAlertForm() {
    var qty = document.getElementById('qtyInput');
    var upc = document.getElementById('upcInput');
    qty.value='';
    upc.value='';
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
