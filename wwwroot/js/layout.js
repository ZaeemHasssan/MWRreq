$(document).ready(function () {
    $.ajax({
        url: '/api/AuthAPI/IsAdmin',
        type: 'GET',
        success: function (data) {
            if (data.isAdmin) {
                $('#adminLinks').show();
            }
        },
        error: function (xhr, status, error) {
            console.error('Error checking admin role:', error);
        }
    });
});


$('#signout').click(function () {
    // Send AJAX POST request to sign out endpoint
    $.ajax({
        url: '/api/AuthAPI/Signout', // Update with your controller and action name
        type: 'POST',
        success: function (response) {
            // On success, redirect to the login page
            window.location.href = '/Auth/Login'; // Update with your login page URL
        },
        error: function (xhr, status, error) {
            // Handle error (you can display error messages or perform other actions)
            console.error(error);
        }
    });
});