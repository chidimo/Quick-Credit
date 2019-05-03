const signin_form = document.getElementById('signin_form');
const signup_form = document.getElementById('signup_form');

const activate_signup = document.getElementById('activate_signup');
const activate_signin = document.getElementById('activate_signin');

activate_signin.addEventListener('click', e => {
    e.preventDefault();
    signup_form.classList.add('hide_form');
    signin_form.classList.remove('hide_form');

    activate_signin.classList.remove('deselected');
    activate_signup.classList.add('deselected');
});

activate_signup.addEventListener('click', e => {
    e.preventDefault();
    signin_form.classList.add('hide_form');
    signup_form.classList.remove('hide_form');

    activate_signup.classList.remove('deselected');
    activate_signin.classList.add('deselected');
});
