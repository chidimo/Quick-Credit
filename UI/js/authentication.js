const signin_form = document.getElementById('signin_form');
const signup_form = document.getElementById('signup_form');

const activate_signup = document.getElementById('activate_signup');
const activate_signin = document.getElementById('activate_signin');

const sign_in_button = document.getElementById('sign_in_button');
const sign_up_button = document.getElementById('sign_up_button');

// temporarily redirect the sign up and sign in pages to dashboard
sign_in_button.addEventListener('click', e => {
    e.preventDefault();
    window.location = './dashboard.html';
});

sign_up_button.addEventListener('click', e => {
    e.preventDefault();
    window.location = './dashboard.html';
});

activate_signin.addEventListener('click', e => {
    e.preventDefault();
    signup_form.classList.add('hide_form');
    signin_form.classList.remove('hide_form');

    activate_signin.classList.add('selected');
    activate_signup.classList.remove('selected');
});

activate_signup.addEventListener('click', e => {
    e.preventDefault();
    signin_form.classList.add('hide_form');
    signup_form.classList.remove('hide_form');

    activate_signup.classList.add('selected');
    activate_signin.classList.remove('selected');
});
