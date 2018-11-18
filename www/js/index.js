//===============================================================================================
// index.js
// This holds the main JavaScript for the Application
// By: Luis Castro
//===============================================================================================

// Created an SQLite DB
var db = window.sqlitePlugin.openDatabase({name: 'mySQLite.db', location: 'default'});

db.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS invList (id integer primary key, title text, desc text)', [],
    function(tx, result) {
        alert('Table created successfully');
    },
    function(error) {
        alert('Error occurred while creating table');
    });
});

function insertData() {
    var name = document.getElementById('dName').innerHTML;
    var location = document.getElementById('dLocation').innerHTML;

    db.transaction(function(transaction) {
        var executeQuery = 'INSERT INTO invList (name, location) VALUE (?, ?)';
        transaction.executeSql(executeQuery, [name, location],
            function() {
                alert('Inserted');
            },
            function(error) {
                alert('Error occurred');
            }
        );
    });
}

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

    clearForm();
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
