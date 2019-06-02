import { BASE_URL, common_headers } from './common/constants.js';

/* eslint-disable no-undef */
const logout = document.getElementById('logout');
const profile_edit_form = document.getElementById('profile_edit_form');

const user = JSON.parse(localStorage.getItem('user'));
const {
    id, firstname, lastname, phone, address,
} = user;

// DOM substitutions

const fname = document.querySelector('input[name="first_name"]');
const lname = document.querySelector('input[name="last_name"]');
const ph = document.querySelector('input[name="phone_number"]');
const hm = document.querySelector('textarea[name="home_address"]');
const off = document.querySelector('textarea[name="office_address"]');
const profile_err = document.getElementById('profile_err');
const loading_modal = document.getElementById('loading_modal');

fname.value = firstname;
lname.value = lastname;
ph.value = phone;
hm.value = address.home;
off.value = address.office;

// end DOM substitutions

logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location = './authentication.html';
});

const endpoint = `${BASE_URL}/users/${id}/update`;

const update_profile = async (endpoint, body) => {
    const config = {
        headers: {
            ...common_headers,
            'Content-Type': 'application/json',
        },
    };
    loading_modal.style.display = 'block';
    try {
        const {
            data, status
        } = await axios.patch(endpoint, body, config);
        const user = data.data;
        if (status === 200) {
            localStorage.user = JSON.stringify(user);
        }
        return { user };
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        // console.log(`${JSON.stringify(data)}, \n ${status}`);
        if (status === 422) return data.errors[0].msg;
        return data.error;
    }
};

profile_edit_form.addEventListener('submit', async e => {
    e.preventDefault();
    const firstname = fname.value;
    const lastname = lname.value;
    const phone = ph.value;
    const home = hm.value;
    const office = off.value;

    const body = JSON.stringify({ firstname, lastname, phone, home, office });
    const data = await update_profile(endpoint, body);
    loading_modal.style.display = 'none';

    if (data.user) {
        window.location = './dashboard.html';
        return;
    }
    profile_err.innerHTML = `<p class='error-from-api'>${data}</p>`;
});
