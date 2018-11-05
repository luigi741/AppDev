//===============================================================================================
// index.js
// This holds the main JavaScript for the Application
// By: Luis Castro
//===============================================================================================

// Created an SQLite DB
var db = window.sqlitePlugin.openDatabase({name: 'mySQLite.db', location: 'default'});

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
    list1.innerHTML = item.name;

    var list2 = document.createElement('P');
    list2.innerHTML = item.location;

    document.getElementById('dialogList').appendChild(list2);
    document.getElementById('dialogList').appendChild(list1);
    document.getElementById('dialog-1').show();


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
