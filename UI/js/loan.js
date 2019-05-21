const approve_loan_application = document.getElementById(
    'approve_loan_application'
);
const reject_loan_application = document.getElementById(
    'reject_loan_application'
);

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
