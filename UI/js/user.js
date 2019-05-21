const verify_user = document.getElementById('verify_user');
const un_verify_user = document.getElementById('un_verify_user');

const promptUser = (text, defaultText, msg) => {
    const cont = prompt(text, defaultText);
    if (cont !== null) {
        alert(msg);
    }
};

verify_user.addEventListener('click', e => {
    e.preventDefault();

    promptUser(
        'Confirm user verification',
        'Click okay to verify this user',
        'User was verified.'
    );
    return;
});

un_verify_user.addEventListener('click', e => {
    e.preventDefault();

    promptUser(
        'Confirm revoking user verification',
        "Click okay to revoke this user's verification",
        "User's verification was revoked."
    );
    return;
});
