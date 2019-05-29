import { address } from './user.js';

const home = document.getElementById('home');
const office = document.getElementById('office');

home.textContent = address.home;
office.textContent = address.office;