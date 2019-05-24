
const profile_pix = document.getElementById('profile_pix');
const img_uploader = document.querySelector('input[id=img_uploader]');

profile_pix.addEventListener('click', e => {
    e.preventDefault();
    img_uploader.click();
});

const id = 1;
const bucket = 'quick-credit';
const folder = 'profile_photos';
const endpoint = 's3.eu-west-2.amazonaws.com';
const base_url = 'https://qcredit.herokuapp.com/api/v1';
// const base_url = 'http://localhost:3000';

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
    // const filename = file.name;
    // const ext = filename.slice(filename.lastIndexOf('.') + 1);
    const signed_upload_url = await axios_get_signed_url(id, filetype);
    const photo_aws_url = await upload_to_aws(id, file, signed_upload_url);
    const user = await update_photo_in_db(id, photo_aws_url);
    return user;
};

// step 1: get a signed URL
const axios_get_signed_url = async (id, filetype) => {
    const url = `${base_url}/users/${id}/photo/upload`;
    const body = { filetype };
    // eslint-disable-next-line no-undef
    const resp = await axios.get(url, body);
    return resp.data.signed_url;
};

// step 2. Upload to AWS S3 bucket   
const upload_to_aws = async (id, file, signed_url) => {
    const filetype = file.type;
    const config = {
        headers: { 
            'Content-Type': filetype,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3000',
        },
        onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            console.log(`loaded: ${loaded}, total: ${total}`);
        }
    };

    // eslint-disable-next-line no-undef
    const resp = await axios.put(signed_url, file, config);
    if (resp.status === 200) {
        const aws_url = `https://${endpoint}/${bucket}/${folder}/${id}`;
        return aws_url;
    }
};

// step 3. Update photo in db
const update_photo_in_db = async (id, photo_url) => {
    const url = `${base_url}/users/${id}/photo/update`;
    const body = { photo_url };
    // eslint-disable-next-line no-undef
    const resp = await axios.patch(url, body);
    return resp;
};
