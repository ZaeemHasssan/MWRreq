$(document).ready(function () {
    $('#toggleFirstPassword').click(function () {
        const passwordInput = $('#loginPasswordInput');
        const isPasswordVisible = passwordInput.attr('type') === 'password';
        passwordInput.attr('type', isPasswordVisible ? 'text' : 'password');
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    $('#toggleRepeatPassword').click(function () {
        const passwordInput = $('#repeatPasswordInput');
        const isPasswordVisible = passwordInput.attr('type') === 'password';
        passwordInput.attr('type', isPasswordVisible ? 'text' : 'password');
        $(this).toggleClass('fa-eye fa-eye-slash');
    });
});

// Event listener for the form submission
// Bind input event listeners to trigger validation on input change
$('#fName').on('input', function () {
    validateFirstName();
});
$('#lName').on('input', function () {
    validateLastName();
});
$('#username').on('input', function () {
    validateUsername();
});
$('#disciplineSelect').on('change', function () {
    validateDisciplineSelect();
});
$('#loginPasswordInput, #repeatPasswordInput').on('input', function () {
    validatePasswords();
    validateRepeatPasswords();
});
$('#admin, #user').on('change', function () {
    validateRoles();
});



// Function to validate first name
function validateFirstName() {
    var firstName = $('#fName').val().trim();
    if (!firstName) {
        $('#fNameError').text("First name is required.");
        return false;
    } else if (!/^[a-zA-Z]{2,}$/.test(firstName)) {
        $('#fNameError').text("Give at least two alphabets.");
        return false;
    } else {
        $('#fNameError').text("");
        return true;
    }
}

// Function to validate last name
function validateLastName() {
    var lastName = $('#lName').val().trim();
    if (!lastName) {
        $('#lNameError').text("Last name is required.");
        return false;
    } else if (!/^[a-zA-Z]{2,}$/.test(lastName)) {
        $('#lNameError').text("Last name should contain at least two alphabets.");
        return false;
    } else {
        $('#lNameError').text("");
        return true;
    }
}

// Function to validate username
function validateUsername() {
    var username = $('[placeholder="User Name"]').val().trim();
    if (!username) {
        $('#usernameError').text("Field is required.");
        return false;
    }
    else if (!isValidEmail(username)) {
        $('#usernameError').text("Please enter a valid email address as the username.");
        return false;
    }
    else {
        $('#usernameError').text("");
        return true;
    }
}

// Function to validate role select
function validateDisciplineSelect() {
    var selectedOption = $('#disciplineSelect').val();
    var checkdisciplinevalue = $('#disciplineSelect').val();
    if (!selectedOption) {
        $('#disciplineSelectError').text("Field is required.");
        return false;
    } else if (checkdisciplinevalue == 9) {
        var Admin = document.getElementById("admin");
        var User = document.getElementById('user');
        Admin.checked = true;
        User.checked = false
        $('#disciplineSelectError').text("");
        return true;
    }else {
        $('#disciplineSelectError').text("");
        return true;
    }
}

// Function to validate passwords
function validatePasswords() {
    var password = $('#loginPasswordInput').val();
    if (!password) {
        $('#passwordError').text("Field is required.");
        return false;
    }
    else if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/.test(password)) {
        $('#passwordError').text("Password must contain at least 6 characters long and 1 digit");
    }
    else {
        $('#passwordError').text("");
        return true;
    }
}

// Function to validate passwords
function validateRepeatPasswords() {
    var password = $('#loginPasswordInput').val();
    var repeatPassword = $('#repeatPasswordInput').val();
    if (!repeatPassword) {
        $('#repeatPasswordError').text("Field is required.");
        return false;
    }
    else if (password !== repeatPassword) {
        $('#repeatPasswordError').text("Password did not match.");
        return false;
    }
    else {
        $('#repeatPasswordError').text("");
        return true;
    }
}

// Function to validate roles
function validateRoles() {
    var adminChecked = $('#admin').is(':checked');
    var userChecked = $('#user').is(':checked');
    if (!adminChecked && !userChecked) {
        $('#roleError').text("Please select at least one role.");
        return false;
    } else {
        $('#roleError').text("");
        return true;
    }
}

// Function to validate email format
function isValidEmail(email) {
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function adminCheckbox() {
    // Get the checkbox
    var Admin = document.getElementById("admin");
    var User = document.getElementById('user');
    // If the checkbox is checked, display the output text
    if (Admin.checked) {
        User.checked = false;
        $('#disciplineSelect').val(9);
    }
    // If the checkbox is checked, display the output text
    if (!Admin.checked) {
        User.checked = false;
        $('#disciplineSelect').val('').prop('disabled', false);
    }
}
function userCheckbox() {
    // Get the checkbox
    var Admin = document.getElementById("admin");
    var User = document.getElementById('user');
    // If the checkbox is checked, display the output text
    if (User.checked) {
        Admin.checked = false;
        var checkdiscipline = $('#disciplineSelect').val();
        if (checkdiscipline == 9) {
            $('#disciplineSelect').val('').prop('disabled', false);
        }
        
    }
}


$("#register_submit").click(function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    $('#loader').show();
    // Perform validation
    var isValid = true;
    isValid = validateFirstName() && isValid;
    isValid = validateLastName() && isValid;
    isValid = validateUsername() && isValid;
    isValid = validateDisciplineSelect() && isValid;
    isValid = validatePasswords() && isValid;
    isValid = validateRepeatPasswords() && isValid;
    isValid = validateRoles() && isValid;

    // If all validations pass, submit the form
    if (isValid) {
        // Get values from form inputs
        var firstName = $('#fName').val();
        var lastName = $('#lName').val();
        var email = $('#username').val();
        var password = $('#loginPasswordInput').val();
        var repeatPassword = $('#repeatPasswordInput').val();
        var departmentId =  $('#disciplineSelect').val();
        var roleId = $('#admin').is(':checked') ? 1 : ($('#user').is(':checked') ? 2 : 0);

        // Create data object to send
        var data = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password,
            DepartmentId: departmentId,
            RoleId: roleId
        };

        // Send AJAX POST request to API controller's register endpoint
        $.ajax({
            url: '/api/AuthAPI/Register', // Update the URL to match your API controller endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                // Show the modal
                $("#successModel").modal("show");
            },
            error: function (xhr, status, error) {
                if (xhr.status === 409) { // Conflict status
                    $('#responseError').text("User already exists.");
                } else {
                    alert("An error occurred: " + error);
                }
            },
            complete: function () {
                $('#loader').hide(); // Hide the loader regardless of success or error
            }
        });

    }
});
function modalClose() {
    $('#fName').val('');
    $('#lName').val('');
    $('#username').val('');
    $('#loginPasswordInput').val('');
    $('#repeatPasswordInput').val('');
    $('#disciplineSelect').val('');
    
    window.location.href = '/users';
}
