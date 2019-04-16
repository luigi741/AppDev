//===============================================================================================
// index.js
// This holds the main JavaScript for the Application
// By: Luis Castro
//===============================================================================================
// Global variables

var user;
var name, email, photoUrl, uid, emailVerified;

// Application Functions
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

// Function to login into the application
function login() {
    let userEmail = document.getElementById('username').value;
    let userPswd = document.getElementById('password').value;
  
    firebase.auth().signInWithEmailAndPassword(userEmail, userPswd).then(user => {
        // Get user information
        user = firebase.auth().currentUser;

        // Extract data from the user object
        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
        }
        
        // Transfer to index.html upon successful login
        window.location = 'index.html';
    }).catch(error => {
        // Catch errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        
        // Prompt user with error message
        window.alert("Error: " + errorMessage); 
    })
  };

// Function to sign out of the applicaiton
function logout() {
    firebase.auth().signOut().then(function() {
        // Successful logout!
        // Transfer to login.html upon successful logout
        window.location = 'login.html';
      }).catch(function(error) {
          //Logout error!
          window.alert(error.message);
      });
};

// Barcode scanner function utilizing the Cordova barcode scanning function.
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
}

function homePage() {
    var home = document.getElementById('canvas');
    canvas.style = 'visibility: hidden';
}

app.initialize();
