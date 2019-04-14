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
// Switch to user page
function userPage(){
    let userPage = document.getElementById('userPageCanvas');
    window.location.href = "userPage.html";

}
// Switch to user list page.
function userListPage(){
    let userListPage = document.getElementById('userListPageCanvas');
    window.location.href = "userListPage.html";
}
app.initialize();
