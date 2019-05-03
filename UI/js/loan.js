const approve_loan_application = document.getElementById(
    'approve_loan_application'
);
const reject_loan_application = document.getElementById(
    'reject_loan_application'
);

approve_loan_application.addEventListener('click', e => {
    e.preventDefault();
    const cont = prompt(
        'Please confirm if you want to approve this loan?',
        'Click okay to approve this loan request');
    
    if (cont !== null) {
        alert('Loan application was approved');
        // send email notification
    }

    return;
});

reject_loan_application.addEventListener('click', e => {
    e.preventDefault();
    const cont = prompt(
        'Please confirm if you want to reject this loan?',
        'Click okay to reject this loan request');
    
    if (cont !== null) {
        alert('Loan application was rejected');
        // send email notification
    }

    return;
});

const loan_payment_modal = document.getElementById('loan_payment_modal');
window.onclick = function(e) {
    if (e.target === loan_payment_modal) {
        loan_payment_modal.style.display = 'none';
    }
};
