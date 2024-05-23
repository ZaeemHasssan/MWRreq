
$(document).ready(function () {

    getData();

    


    $('#toggleOldPassword').click(function () {
        const passwordInput = $('#oldPasswordInput');
        const isPasswordVisible = passwordInput.attr('type') === 'password';
        passwordInput.attr('type', isPasswordVisible ? 'text' : 'password');
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    $('#toggleNewPassword').click(function () {
        const newPasswordInput = $('#newPasswordInput');
        const isNewPasswordVisible = newPasswordInput.attr('type') === 'password';
        newPasswordInput.attr('type', isNewPasswordVisible ? 'text' : 'password');
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    $('#toggleRepeatNewPassword').click(function () {
        const repeatNewpasswordInput = $('#repeatNewPasswordInput');
        const isRepeatNewPasswordVisible = repeatNewpasswordInput.attr('type') === 'password';
        repeatNewpasswordInput.attr('type', isRepeatNewPasswordVisible ? 'text' : 'password');
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

});

// Function to get cookie value by name
function getData() {
    // Send AJAX POST request to API controller's register endpoint
    $.ajax({
        url: '/api/AuthAPI/GetCookiesData', // Update the URL to match your API controller endpoint
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            $("#username").val(response.email);
        },
        error: function (xhr, status, error) {
            // Handle error (you can display error messages or perform other actions)
            console.error(error);
        }
    });
}



// Function to validate passwords
$('#oldPasswordInput').on('input', function () {
    validateOldPassword();
});

function validateOldPassword() {
    var oldPassword = $('#oldPasswordInput').val();
    if (!oldPassword) {
        $('#oldPasswordError').text("Field is required.");
        return false;
    }
    else {
        $('#oldPasswordError').text("");
        return true;
    }
}

// Function to validate new password
$('#newPasswordInput').on('input', function () {
    validateNewPassword();
});

function validateNewPassword() {
    var newPassword = $('#newPasswordInput').val();
    if (!newPassword) {
        $('#newPasswordError').text("Field is required.");
        return false;
    }
    else if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/.test(newPassword)) {
        $('#newPasswordError').text("Password must contain at least 6 characters long and 1 digit");
    }
    else {
        $('#newPasswordError').text("");
        return true;
    }
}

// Function to validate new repeat password
$('#repeatNewPasswordInput').on('input', function () {
    validateRepeatNewPassword();
});

function validateRepeatNewPassword() {
    var newPassword = $('#newPasswordInput').val();
    var repeatNewPassword = $('#repeatNewPasswordInput').val();
    if (!repeatNewPassword) {
        $('#repeatNewPasswordError').text("Field is required.");
        return false;
    }
    else if (newPassword !== repeatNewPassword) {
        $('#repeatNewPasswordError').text("Password did not match.");
        return false;
    }
    else {
        $('#repeatNewPasswordError').text("");
        return true;
    }
}


$("#changePassword_submit").click(function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Perform validation
    var isValid = true;
    isValid = validateOldPassword() && isValid;
    isValid = validateNewPassword() && isValid;
    isValid = validateRepeatNewPassword() && isValid;

    // If all validations pass, submit the form
    if (isValid) {
        // Get values from form inputs
        var username = $('#username').val();
        var oldPassword = $('#oldPasswordInput').val();
        var newPassword = $('#newPasswordInput').val();

        // Create data object to send
        var data = [username, oldPassword, newPassword];
        $('#loader').show();
        // Send AJAX POST request to API controller's register endpoint
        $.ajax({
            url: '/api/AuthAPI/ChangePassword', // Update the URL to match your API controller endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                $("#myModal").modal("show");
            },
            error: function (xhr, status, error) {
                if (status === 400) {
                    $('#oldPasswordError').text(error); // Display error message to user
                } else {
                    console.error(error); // Log other errors to console
                }
                
            },
            complete: function () {
                $('#loader').hide();
            }
        });

    }
});

function modalClose() {
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
}