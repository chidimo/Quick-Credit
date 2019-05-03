const edit_profile_modal = document.getElementById('edit_profile_modal');
const loan_application_modal = document.getElementById(
    'loan_application_modal'
);

// Close modal if user clicks outside modal
window.onclick = function(e) {
    if (e.target === edit_profile_modal) {
        edit_profile_modal.style.display = 'none';
    }
    else if (e.target === loan_application_modal) {
        loan_application_modal.style.display = 'none';
    }
};
