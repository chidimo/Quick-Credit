const approve_loan_application = document.getElementById(
    'approve_loan_application'
);
const reject_loan_application = document.getElementById(
    'reject_loan_application'
);
const logout = document.getElementById('logout');

const images = document.getElementsByClassName('photos');
const fname = document.getElementsByClassName('firstname');
const lname = document.getElementsByClassName('lastname');
const em = document.getElementById('email');
const ph = document.getElementById('phone');

const user = JSON.parse(localStorage.user);
const {
    email, firstname, lastname, photo, phone, isadmin, status, mailverified,
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
for (const name of fname) {
    name.textContent = firstname;
}
for (const name of lname) {
    name.textContent = lastname;
}
ph.textContent = phone;
em.textContent = email;

logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location = './authentication.html';
});

const promptUser = (text, defaultText, msg) => {
    const cont = prompt(text, defaultText);
    if (cont !== null) {
        alert(msg);
    }
};

approve_loan_application.addEventListener('click', e => {
    e.preventDefault();
    promptUser(
        'Confirm loan approval',
        'Click okay to approve this loan request',
        'Loan application was approved'
    );
    return;
});

reject_loan_application.addEventListener('click', e => {
    e.preventDefault();
    promptUser(
        'Confirm loan rejection',
        'Click okay to reject this loan request',
        'Loan application was rejected'
    );
    return;
});

const loan_payment_modal = document.getElementById('loan_payment_modal');
window.onclick = function(e) {
    if (e.target === loan_payment_modal) {
        loan_payment_modal.style.display = 'none';
    }
};
