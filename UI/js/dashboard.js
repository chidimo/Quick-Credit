/* eslint-disable no-undef */
import {
    id,
    status,
    mailverified,
    firstname,
    lastname
} from './common/user.js';

import {
    retrieve_signed_url,
    upload_to_aws,
    update_photo_in_db
} from './common/img_uploader.js';

import { BASE_URL } from './common/constants.js';

const mailverification = document.getElementById('mailverification');
const profile_pix = document.getElementById('profile_pix');
const img_uploader = document.querySelector('input[id=img_uploader]');
const dash_firstname = document.getElementById('dash_firstname');
const dash_lastname = document.getElementById('dash_lastname');
const circles = document.getElementsByClassName('fa-check-circle');

profile_pix.addEventListener('click', e => {
    e.preventDefault();
    img_uploader.click();
});

mailverification.addEventListener('click', async e => {
    e.preventDefault();
    const url = `${BASE_URL}/users/${id}/account/mail`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
        alert(`${data.msg}\nPlease check your inbox`);
    }
});

img_uploader.onchange = async e => {
    e.preventDefault();
    const [ file ] = e.target.files;
    const fsize = file.size;
    const filetype = file.type.slice(6,); // remove 'image/' portion
    const size_in_mb = (fsize / (1024 * 1024)).toFixed(2);

    if (fsize > 1024 * 1024 * 1) {
        alert(`File is ${size_in_mb}MB. Allowed size is 1MB.`);
        return;
    }
    // const ext = file.name.slice(filename.lastIndexOf('.') + 1);
    const signed_upload_url = await retrieve_signed_url(id, filetype);
    const photo_aws_url = await upload_to_aws(id, file, signed_upload_url);
    const user = await update_photo_in_db(id, photo_aws_url);
    localStorage.user = JSON.stringify(user);
};

// DOM substitutions

dash_firstname.textContent = firstname;
dash_lastname.textContent = lastname;

for (const circle of circles) {
    if (status === 'verified') {
        circle.classList.toggle('status-ok');
    }
}

if (mailverified) {
    mailverification.style.display = 'none';
}
