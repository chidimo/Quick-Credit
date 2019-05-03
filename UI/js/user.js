const verify_user = document.getElementById('verify_user');
const un_verify_user = document.getElementById('un_verify_user');

verify_user.addEventListener('click', e => {
    e.preventDefault();
    const cont = prompt(
        'Please confirm if you want to verify this user',
        'Click okay to reject this loan request');
    
    if (cont !== null) {
        // verify user
        alert('User was verified.');
        // Send email notification
    }

    return;
});

un_verify_user.addEventListener('click', e => {
    e.preventDefault();
    const cont = prompt(
        "Please confirm if you want to verify revoke this user's verification",
        "Click okay to revoke this user's verification");
    
    if (cont !== null) {
        // revoke verification
        alert("User's verification was revoked.");
        // Send email notification
    }

    return;
});
