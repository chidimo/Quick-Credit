const logout = document.getElementById('logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location = './authentication.html';
});
