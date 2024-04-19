'use strict';

function printLabel(message) {
    let label = document.createElement('h1');
    label.textContent = message;
    document.body.appendChild(label);
}

function showApplication() {
    const div = document.getElementById('application');
    div.style.display = 'flex';
}

async function init() {
    try{ 
    let response = await axios.post('/auth/verify', {
        jwt: localStorage.getItem('jwt'),
    });

    showApplication();

    } catch(err) {
        let message = `${err.response.data.statusCode} - ${err.response.data.error}: ${err.response.data.message}`;
        printLabel(message);
    }  
}

init();