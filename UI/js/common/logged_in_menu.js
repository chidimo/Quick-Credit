import { firstname, lastname, photo } from './user.js';
import { token_name } from './constants.js';

const logout = document.getElementById('logout');

const images = document.getElementsByClassName('photos');
const sub_menu_firstname = document.getElementById('sub_menu_firstname');
const sub_menu_lastname = document.getElementById('sub_menu_lastname');

logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem(token_name());
    localStorage.removeItem('user');
    localStorage.removeItem('user_loans');
    window.location = './authentication.html';
});

// DOM substitutions
for (const image of images) {
    image.src = photo;
}

sub_menu_firstname.textContent = firstname;
sub_menu_lastname.textContent = lastname;
