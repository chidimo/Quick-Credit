const logout = document.getElementById('logout');
const images = document.getElementsByClassName('photos');

const user = JSON.parse(localStorage.user);
const {
    photo
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
