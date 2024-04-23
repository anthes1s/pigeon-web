'use strict';

function showStatusLabel(message, color) {
  const div = document.getElementById('form');

  let check = document.getElementById('statusLabel');
  if (check) {
    div.removeChild(check);
  }

  const label = document.createElement('label');
  label.id = 'statusLabel';
  label.textContent = message;
  label.style.color = color;

  div.appendChild(label);
}

function init() {
  const buttonSignUp = document.getElementById('buttonSignUp');

  buttonSignUp.addEventListener('click', async () => {
    try {
      const inputLogin = document.getElementById('inputLogin');
      const inputPassword = document.getElementById('inputPassword');

      if (inputPassword.value.length < 8) {
        throw new Error('Your password is too short!');
      }

      let response = await axios.post('/auth/register', {
        username: inputLogin.value,
        password: inputPassword.value,
      });

      console.log(response.data);
      showStatusLabel('Registration successful!', 'Green');

      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('username', response.data.username);

      setTimeout(() => (window.location.href = '/chat'), 1000);
    } catch (error) {
      if (error.response?.data?.message)
        showStatusLabel(error.response.data.message, 'Red');
      else showStatusLabel(error.message, 'Red');
    }
  });
}

init();
