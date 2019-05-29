import { email, firstname, lastname, photo, phone } from './user.js';

const dp = document.getElementById('dp');
const user_info_firstname = document.getElementById('user_info_firstname');
const user_info_lastname = document.getElementById('user_info_lastname');
const em = document.getElementById('email');
const ph = document.getElementById('phone');

// DOM substitutions

dp.style = `background-image: url('${photo}')`;
user_info_firstname.textContent = firstname;
user_info_lastname.textContent = lastname;
ph.textContent = phone;
em.textContent = email;
