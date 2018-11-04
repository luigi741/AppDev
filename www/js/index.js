
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
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
    document.getElementById('dialog-1').show();
}

function dialogClose() {
    document.getElementById('dialog-1').hide();
}

function invPage() {
    var canvas = document.getElementById('canvas');
    canvas.style = '';
}

function newList() {
    var item = {};
    item.name = document.getElementById('listName').value;
    item.location = document.getElementById('location').value;
    console.log(item);
}

app.initialize();
