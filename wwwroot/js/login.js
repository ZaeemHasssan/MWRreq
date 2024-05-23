
$('#togglePassword').click(function () {
    const passwordInput = $('#passwordInput');
    const isPasswordVisible = passwordInput.attr('type') === 'password';
    passwordInput.attr('type', isPasswordVisible ? 'text' : 'password');
    $(this).toggleClass('fa-eye fa-eye-slash');
});

$('#username').on('input', function () {
    validateEmail();
});
$('#password').on('input', function () {
    validatePassword();
});


// Function to validate username
function validateEmail() {
    var username = $('#username').val();
    if (!username) {
        $('#usernameError').text("Field is required.");
        return false;
    }
    else if (!isValidEmail(username)) {
        $('#usernameError').text("Please enter a valid email address as the username."); UNandPassError
        return false;
    }
    else {
        $('#usernameError').text("");
        return true;
    }
}
// Function to validate email format
function isValidEmail(email) {
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

$('#loginBtn').click(function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    // Perform validation
    var isValid = true;
    isValid = validateEmail() && isValid;
    isValid = validatePassword() && isValid;
    if (isValid) {
        var userName = $('#username').val();
        var password = $('#password').val();

        // Create data object to send
        var data = {
            Email: userName,
            Password: password
        };
        // Send AJAX POST request to API controller's register endpoint
        $.ajax({
            url: '/api/AuthAPI/Login', // Update the URL to match your API controller endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response == "User Not Found") {
                    $('#UNandPassError').text("Username or Password is invalid."); 
                }
                else {
                    // Redirect to dashboard or another page on successful registration
                    //window.location.href = '/Home/Mails';
                    window.location.href = '/complaints';
                }
            },
            error: function (xhr, status, error) {
                // Handle error (you can display error messages or perform other actions)
                console.error(error);
            }
        });
    }
});


// Function to validate passwords
function validatePassword() {
    var password = $('#password').val();
    if (!password) {
        $('#passwordError').text("Field is required.");
        return false;
    }
    else if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/.test(password)) {
        $('#passwordError').text("Password is Wrong");
    }
    else {
        $('#passwordError').text("");
        return true;
    }
}

