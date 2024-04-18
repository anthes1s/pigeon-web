'use strict';

async function init() {
    let response = await axios.post('/auth/verify', {
        jwt: localStorage.getItem('jwt'),
    });
    
    let success = response.data.success;
    if(success) {
        // Establish a Socket.io connection and render the page
        const socket = io('/chat');
    } else {
        // Show '403 - Forbidden' sign
        
    }
}

init();