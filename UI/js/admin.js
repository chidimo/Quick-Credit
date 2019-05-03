const edit_profile_modal = document.getElementById('edit_profile_modal');

// Close modal if user clicks outside modal
window.onclick = e => {
    if (e.target === edit_profile_modal) {
        edit_profile_modal.style.display = 'none';
    }
};
