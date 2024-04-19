'use strict';

function showStatusLabel(message, color) {
    const div = document.getElementById('form');

    let check = document.getElementById('statusLabel')
    if(check) {
        div.removeChild(check);
    }

    const label = document.createElement('label');
    label.id = "statusLabel";
    label.textContent = message;
    label.style.color = color;
    
    div.appendChild(label);
}

function init() {
    const buttonSignIn = document.getElementById('buttonSignIn');
    
    buttonSignIn.addEventListener('click', async () => {
        try { 
            const inputLogin = document.getElementById('inputLogin');
            const inputPassword = document.getElementById('inputPassword');

            let response = await axios.post('/auth/login', {
                username: inputLogin.value,
                password: inputPassword.value,
            });

            console.log(response.data);

            let success = response.data.success;
            if(success) {
            // Add JWT to the localStorage and redirect to the '/chat' route;
                localStorage.setItem('jwt', response.data.jwt);
                localStorage.setItem('username', response.data.username);
                window.location.href = '/chat';
            }
            
        } catch(error) {
            if(error.response?.data?.message) showStatusLabel(error.response.data.message, 'Red');
            else showStatusLabel(error.message, 'Red');
        }
    });
}

init();