import api from './APIClient.js';

const loginButton = document.querySelector('#login-button');
const usernameText = document.getElementById('username');

loginButton.addEventListener('click', e => {
    api.logIn(usernameText.value).then(user => {
        document.location = './';
    }).catch((err) => {
        console.log('Error');
    });
});