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
// const base_url = 'http://localhost:3000';
const signupEndpoint = `${base_url}/auth/signup`;
const signinEndpoint = `${base_url}/auth/signin`;

signin_form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('signin_email').value;
    const password = document.getElementById('signin_password').value;

    const body = { email, password };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    };
    fetch(signinEndpoint, options)
        .then(response => {
            if (response.status !== 200) {
                console.log('Request error ', response.status);
            }
            return response.json(); })
        .then(resp => {
            console.log('response ', resp);
            if (resp.error) { alert(resp.error); }
            else {
                localStorage.setItem('QCtoken', resp.data.token);
                window.location = './dashboard.html';
            }
        });
});

signup_form.addEventListener('click', e => {
    e.preventDefault();
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const firstname = document.getElementById('first_name').value;
    const lastname = document.getElementById('last_name').value;

    const body = { email, password, confirm_password };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    };
    fetch(signupEndpoint, options)
        .then(response => {
            if (response.status !== 200) {
                console.log('Request error ', response.status);
            }
            return response.json(); })
        .then(resp => {
            console.log('response ', resp);
            if (resp.error) { alert(resp.error); }
            else {
                localStorage.setItem('QCtoken', resp.data.token);
                window.location = './dashboard.html';
            }
        });
});
