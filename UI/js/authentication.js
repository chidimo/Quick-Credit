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

const swap_classes = (dom_1, dom_2) => {
    dom_1.classList.add('hide_form');
    dom_2.classList.remove('hide_form');
};

const activate_form = (form_1, form_2) => {
    form_1.classList.add('selected');
    form_2.classList.remove('selected');
};

activate_signin.addEventListener('click', e => {
    e.preventDefault();
    swap_classes(signup_form, signin_form);
    activate_form(activate_signin, activate_signup);
});

activate_signup.addEventListener('click', e => {
    e.preventDefault();
    swap_classes(signin_form, signup_form);
    activate_form(activate_signup, activate_signin);
});
