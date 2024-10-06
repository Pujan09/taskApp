  function previewProfilePic(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('profile-pic-preview');
        preview.src = reader.result;
        preview.style.display = 'block'; // Make the preview visible and yes
    }
    reader.readAsDataURL(event.target.files[0]);
}

document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('edit-profile-form');
    const cancelBtn = document.getElementById('cancel-edit');

    // Handle form submission
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Profile updated successfully!');
        // Optionally, redirect or update UI here
    });


    // Handle cancel button
    cancelBtn.addEventListener('click', function() {
        // Optionally, redirect or go back to the previous page
        window.location.href = 'home.html'; // Redirect back to home
    });
});
