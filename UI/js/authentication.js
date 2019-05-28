/* eslint-disable no-undef */
const signin_form = document.getElementById('signin_form');
const signup_form = document.getElementById('signup_form');

const activate_signup = document.getElementById('activate_signup');
const activate_signin = document.getElementById('activate_signin');

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

const base_url = 'https://qcredit.herokuapp.com/api/v1';
// const base_url = 'http://localhost:3000/api/v1';
const signupEndpoint = `${base_url}/auth/signup`;
const signinEndpoint = `${base_url}/auth/signin`;

const save_user = async (endpoint, body, redirect_to) => {
    const config = {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET, POST',
        },
    };
    try {
        const { data, status
        } = await axios.post(endpoint, body, config);
        const user = data.data;
        if ((status === 200) || (status === 201)) {
            localStorage.QCToken = user.token;
            localStorage.user = JSON.stringify(user);
            window.location = redirect_to;
        }
    }
    catch (e) {
        const { response } = e;
        const { data, status, statusText } = response;
        console.log(`
            ${JSON.stringify(data)}, \n ${status}, \n ${statusText}`);
    }
};

signin_form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('signin_email').value;
    const password = document.getElementById('signin_password').value;
    const body = JSON.stringify({ email, password });
    save_user(signinEndpoint, body, './dashboard.html');
});

signup_form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    const body = JSON.stringify({ email, password, confirm_password });
    save_user(signupEndpoint, body, './profile.edit.html');
});
