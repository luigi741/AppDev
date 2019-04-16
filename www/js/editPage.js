let editName;
let editUsername;
//  Creating html elements.
editName = sessionStorage.getItem('name')
editUsername = sessionStorage.getItem('email');
sessionStorage.clear();
let editUserPageCanvas = document.getElementById("editUserPageCanvas");
let card = document.createElement('div');
card.setAttribute('class', 'card');
let usernameTextBox = document.createElement('ons-input');
usernameTextBox.setAttribute('id', 'username');
usernameTextBox.setAttribute('modifier', 'underbar');
usernameTextBox.setAttribute('placeholder', editUsername);
card.append(usernameTextBox);
let nameTextBox = document.createElement('ons-input');
nameTextBox.setAttribute('id', 'name');
nameTextBox.setAttribute('modifier', 'underbar');
nameTextBox.setAttribute('placeholder', editName);
card.append(nameTextBox);
let submitChangesBtn = document.createElement('ons-button');
submitChangesBtn.innerHTML = 'Submit Changes';
submitChangesBtn.setAttribute('onclick', "submit()");
card.append(submitChangesBtn);
editUserPageCanvas.append(card);
// end of html creation

/**when this function runs, it will grab the value in the text boxes and make an object out of them.
 * We also send the old information that was in the textbox to the  API will use the combination of these two objects
 * to find and update the user.
 */
function submit(){
    console.log(nameTextBox.value);
    console.log(usernameTextBox.value);
    let data = JSON.stringify([{name:editName, email:editUsername},{name:nameTextBox.value, email:usernameTextBox.value}]);
    console.log(data);
    var HTTP = new XMLHttpRequest();
    var URL = 'http://54.198.236.52/editSubmit';
    HTTP.open('POST', URL);
    HTTP.setRequestHeader('Content-type', 'application/json');
    HTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(HTTP.responseText);
        window.location.href = "userListPage.html";

    }
};
    HTTP.send(data);

}
