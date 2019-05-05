
const edit_profile_modal = document.getElementById(
    'edit_profile_modal'
);

const loan_payment_modal = document.getElementById('loan_payment_modal');

const verify_user = document.getElementById('verify_user');
const un_verify_user = document.getElementById('un_verify_user');

const loan_application_modal = document.getElementById(
    'loan_application_modal'
);

const approve_loan_application = document.getElementById(
    'approve_loan_application'
);
const reject_loan_application = document.getElementById(
    'reject_loan_application'
);

const signin_form = document.getElementById('signin_form');
const signup_form = document.getElementById('signup_form');
const activate_signup = document.getElementById('activate_signup');
const activate_signin = document.getElementById('activate_signin');

// Admin and dashboard
window.onclick = function(e) {
    if (e.target === edit_profile_modal) {
        edit_profile_modal.style.display = 'none';
        return;
    }
    if (e.target === loan_application_modal) {
        loan_application_modal.style.display = 'none';
        return;
    }
    if (e.target === loan_payment_modal) {
        loan_payment_modal.style.display = 'none';
        return;
    }
};

// loan
if (approve_loan_application) {
    approve_loan_application.addEventListener('click', e => {
        e.preventDefault();
        const cont = prompt(
            'Please confirm if you want to approve this loan?',
            'Click okay to approve this loan request');
            
        if (cont !== null) {
            alert('Loan was approved');
        }
        return;
    });
}

if (reject_loan_application) {
    reject_loan_application.addEventListener('click', e => {
        e.preventDefault();
        const cont = prompt(
            'Please confirm if you want to reject this loan?',
            'Click okay to reject this loan request');
            
        if (cont !== null) {
            alert('Loan was rejected');
        }
            
        return;
    });
}

// authentication
if (activate_signin && activate_signup) {
    activate_signin.addEventListener('click', e => {
        e.preventDefault();
        // console.log('activate_signin clicked');
        signup_form.classList.add('hide_form');
        signin_form.classList.remove('hide_form');
        
        activate_signin.classList.remove('deselected');
        activate_signup.classList.add('deselected');
    });
    
    activate_signup.addEventListener('click', e => {
        e.preventDefault();
        // console.log('activate_signup clicked');
        signin_form.classList.add('hide_form');
        signup_form.classList.remove('hide_form');
        
        activate_signup.classList.remove('deselected');
        activate_signin.classList.add('deselected');
    });
}

// user
if (verify_user && un_verify_user) {
    verify_user.addEventListener('click', e => {
        e.preventDefault();
        const cont = prompt(
            'Confirm if you want to verify this user',
            'Click okay to reject this loan request');
            
        if (cont !== null) {
            // verify user
            alert('User was verified.');
        }
        return;
    });
        
    un_verify_user.addEventListener('click', e => {
        e.preventDefault();
        const cont = prompt(
            "Confirm if you want to verify revoke this user's verification",
            "Click okay to revoke this user's verification");

        if (cont !== null) {
            // revoke verification
            alert("User's verification was revoked.");
        }
        return;
    });
}
