const verify_user = document.getElementById('verify_user');
const un_verify_user = document.getElementById('un_verify_user');

const logout = document.getElementById('logout');
const images = document.getElementsByClassName('photos');
const dp = document.getElementById('dp');
const fname = document.getElementsByClassName('firstname');
const lname = document.getElementsByClassName('lastname');
const em = document.getElementById('email');
const ph = document.getElementById('phone');
const home = document.getElementById('home');
const office = document.getElementById('office');

const user = JSON.parse(localStorage.user);
const {
    email, firstname, lastname, photo, phone, address, isadmin, status, mailverified,
} = user;

logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location = './authentication.html';
});

// DOM substitutions
for (const image of images) {
    image.src = photo;
}
for (const name of fname) {
    name.textContent = firstname;
}
for (const name of lname) {
    name.textContent = lastname;
}
ph.textContent = phone;
em.textContent = email;
home.textContent = address.home;
office.textContent = address.office;

const promptUser = (text, defaultText, msg) => {
    const cont = prompt(text, defaultText);
    if (cont !== null) {
        alert(msg);
    }
};

verify_user.addEventListener('click', e => {
    e.preventDefault();

    promptUser(
        'Confirm user verification',
        'Click okay to verify this user',
        'User was verified.'
    );
    return;
});

un_verify_user.addEventListener('click', e => {
    e.preventDefault();

    promptUser(
        'Confirm revoking user verification',
        "Click okay to revoke this user's verification",
        "User's verification was revoked."
    );
    return;
});
