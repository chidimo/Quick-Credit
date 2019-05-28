const logout = document.getElementById('logout');
const images = document.getElementsByClassName('photos');
const dp = document.getElementById('dp');
const fname = document.getElementsByClassName('firstname');
const lname = document.getElementsByClassName('lastname');
const em = document.getElementById('email');
const ph = document.getElementById('phone');

const user = JSON.parse(localStorage.user);
const {
    email, firstname, lastname, photo, phone, isadmin, status, mailverified,
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
