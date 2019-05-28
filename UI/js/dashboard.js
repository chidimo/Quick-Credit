/* eslint-disable no-undef */

const profile_pix = document.getElementById('profile_pix');
const img_uploader = document.querySelector('input[id=img_uploader]');
const images = document.getElementsByClassName('photos');
const dp = document.getElementById('dp');
const fname = document.getElementsByClassName('firstname');
const lname = document.getElementsByClassName('lastname');
const em = document.getElementById('email');
const ph = document.getElementById('phone');
const home = document.getElementById('home');
const office = document.getElementById('office');
const circles = document.getElementsByClassName('fa-check-circle');
const logout = document.getElementById('logout');

const base_url = 'https://qcredit.herokuapp.com/api/v1';
// const base_url = 'http://localhost:3000/api/v1';

const common_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, PATCH,',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3000',
    'x-access-token': localStorage.QCToken
};

const user = JSON.parse(localStorage.user);
const {
    id, email, firstname, lastname, photo, phone, status, address, mailverified,
} = user;

logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location = './authentication.html';
});

profile_pix.addEventListener('click', e => {
    e.preventDefault();
    img_uploader.click();
});

// DOM substitutions
for (const image of images) {
    image.src = photo;
}
dp.style = `background-image: url('${photo}')`;
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
for (const circle of circles) {
    if (status === 'verified') {
        circle.classList.toggle('status-ok');
    }
}

// const reload_pix = () => {
//     const container = document.getElementById('photo_window');
//     const content = container.innerHTML;
//     container.innerHTML = content; 
    
//     // this line is to watch the result in console , you can remove it later	
//     console.log('Refreshed'); 
// };

// const update_profile_pix = file => {
//     const reader  = new FileReader();
//     reader.addEventListener('load', () => {
//         const { result } = reader;
//         profile_pix.src = result;
//     });
//     if (file) {
//         reader.readAsDataURL(file);
//     }
//     else {
//         const src = `https://${endpoint}/quick-credit/profile_photos/${id}`;
//         profile_pix.src = src;
//     }
// };

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
    const signed_upload_url = await axios_get_signed_url(id, filetype);
    const photo_aws_url = await upload_to_aws(id, file, signed_upload_url);
    const user = await update_photo_in_db(id, photo_aws_url);
    localStorage.user = JSON.stringify(user);
};

// step 1: get a signed URL
const axios_get_signed_url = async (id, filetype) => {
    const url = `${base_url}/users/${id}/photo/upload`;
    const headers = {
        filetype,
        'x-access-token': localStorage.QCToken
    };
    try {
        const { data, status } = await axios.get(url, { headers } );
        if (status === 200) return data.signed_url;
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        console.log(`${JSON.stringify(data)}, \n ${status}`);
    }
};

// step 2. Upload to AWS S3 bucket   
const upload_to_aws = async (id, file, signed_url) => {
    const config = {
        headers: { ...common_headers,
            'Content-Type': file.type, 
        },
        onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            console.log(`loaded: ${loaded}, total: ${total}`);
        }
    };

    try {
        const resp = await axios.put(signed_url, file, config);
        if (resp.status === 200) {
            const bucket = 'quick-credit';
            const folder = 'profile_photos';
            const endpoint = 's3.eu-west-2.amazonaws.com';
            const aws_url = `https://${endpoint}/${bucket}/${folder}/${id}`;
            return aws_url;
        }
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        console.log(`${JSON.stringify(data)}, \n ${status}`);
    }
};

// step 3. Update photo in db
const update_photo_in_db = async (id, photo_url) => {
    const url = `${base_url}/users/${id}/photo/update`;
    const body = { photo_url };
    const config = {
        headers: { ...common_headers, },
    };
    const { data } = await axios.patch(url, body, config);
    const user = data.data;
    return user;
};
