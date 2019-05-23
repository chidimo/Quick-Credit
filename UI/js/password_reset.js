const reset_password_form = document.getElementById('reset_password_form');

reset_password_form.addEventListener('submit', e => {
    e.preventDefault();
    console.log('Reset password');
});
