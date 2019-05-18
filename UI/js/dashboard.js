
const profile_pix = document.getElementById('profile_pix');
const img_uploader = document.querySelector('input[id=img_uploader]');

profile_pix.addEventListener('click', e => {
    e.preventDefault();
    img_uploader.click();
});

const update_profile_pix = file => {
    const reader  = new FileReader();
    reader.addEventListener('load', () => {
        const { result } = reader;
        profile_pix.src = result;
    });
    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        profile_pix.src = './img/chidi.jpg';
    }
};

img_uploader.onchange = e => {
    e.preventDefault();
    const [ file ] = e.target.files;
    const fsize = file.size;
    const size_in_mb = (fsize / (1024 * 1024)).toFixed(2);

    if (fsize > 1024 * 1024 * 1) {
        alert(`File is ${size_in_mb}MB. Allowed size is 1MB.`);
        return;
    }
    update_profile_pix(file);
    // upload photo to AWS S3
    // get a presigned url with post request POST /users/presigned_url
    // upload to S3
    // save file path to database POST /users/:id/:aws_url
};

const url = 'http://localhost:3000/users';

// eslint-disable-next-line no-undef
axios
    .get(url)
    .then((response) => {
        const { data } = response;
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });
