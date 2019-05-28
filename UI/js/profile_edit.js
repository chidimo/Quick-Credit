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

const base_url = 'https://qcredit.herokuapp.com/api/v1';
// const base_url = 'http://localhost:3000/api/v1';
const endpoint = `${base_url}/users/${id}/update`;

const update_profile = async (endpoint, body, redirect_to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH',
            'x-access-token': localStorage.QCToken,
        },
    };
    try {
        const {
            data, status
        } = await axios.patch(endpoint, body, config);
        const user = data.data;
        if (status === 200) {
            localStorage.user = JSON.stringify(user);
            window.location = redirect_to;
        }
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        console.log(`${JSON.stringify(data)}, \n ${status}`);
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
    update_profile(endpoint, body, './dashboard.html');
});
