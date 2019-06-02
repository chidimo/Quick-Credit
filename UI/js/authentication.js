import { BASE_URL, common_headers, token_name } from './common/constants.js';

/* eslint-disable no-undef */

const signin_form = document.getElementById('signin_form');
const signup_form = document.getElementById('signup_form');
const loading_modal = document.getElementById('loading_modal');

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

const save_user = async (endpoint, body) => {
    const config = {
        headers: {
            ...common_headers,
            'Content-Type': 'application/json',
        },
    };
    loading_modal.style.display = 'block';
    try {
        const { data, status
        } = await axios.post(endpoint, body, config);
        const user = data.data;
        if ((status === 200) || (status === 201)) {
            localStorage[token_name()] = user.token;
            localStorage.user = JSON.stringify(user);
        }
        return { user };
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        if (status === 422) return data.errors[0].msg;
        return data.error; // status 404 and 409
    }
};

signin_form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('signin_email').value;
    const password = document.getElementById('signin_password').value;
    const sign_in_err = document.getElementById('sign_in_err');

    const body = JSON.stringify({ email, password });
    const data = await save_user(`${BASE_URL}/auth/signin`, body);
    loading_modal.style.display = 'none';

    if (data.user) {
        const { id } = JSON.parse(localStorage.user);
        await get_user_loans(id);
        window.location = './dashboard.html';
        return;
    }
    sign_in_err.innerHTML = `<p class='error-from-api'>${data}</p>`;
});

signup_form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const sign_up_err = document.getElementById('sign_up_err');

    const body = JSON.stringify({ email, password, confirm_password });
    const data = await save_user(`${BASE_URL}/auth/signup`, body);
    loading_modal.style.display = 'none';

    if (data.user) {
        const { id } = JSON.parse(localStorage.user);
        await get_user_loans(id);
        window.location = './profile.edit.html';
        return;
    }
    sign_up_err.innerHTML = `<p class='error-from-api'>${data}</p>`;
});

const get_user_loans = async id => {
    const url = `${BASE_URL}/loans/user/${id}`;
    const headers = {
        ...common_headers,
        'x-access-token': localStorage[token_name()]
    };
    try {
        const { data, status } = await axios.get(url, { headers });
        if (status === 200) {
            localStorage.user_loans = JSON.stringify(data.data);
        }
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        console.log(`${JSON.stringify(data)}, \n ${status}`);
    }
};
