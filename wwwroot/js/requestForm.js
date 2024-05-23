//$("#openModalBtn").click(function () {
//    $("#myModal").modal("show");
//});
$(document).ready(function () {
    var dt = new Date();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var seconds = dt.getSeconds();
    var amPm = hours >= 12 ? "PM" : "AM";

    // Add leading zeros for single-digit minutes and seconds
    minutes = minutes < 10 ? "0" + minutes : minutes;
    
    var datetime = dt.getDate() + "/"
        + (dt.getMonth() + 1) + "/"
        + dt.getFullYear() + " "
        + dt.getHours() + ":"
        + dt.getMinutes() + " "
        + amPm

    $('#dateTime').val(datetime);
});


$('#workArea').on('input', function () {
    validateWorkArea();
});

// Function to validate username
function validateWorkArea() {
    var workArea = $('#workArea').val().trim();
    if (!workArea) {
        $('#workAreaError').text("Field is required.");
        return false;
    }
    else {
        $('#workAreaError').text("");
        return true;
    }
}


$('#prioritySelect').on('change', function () {
    validatepPrioritySelect();
});

// Function to validate role select
function validatepPrioritySelect() {
    var selectedPriorityOption = $('#prioritySelect').val();
    if (!selectedPriorityOption) {
        $('#prioritySelectError').text("Field is required.");
        return false;
    }  else {
        $('#prioritySelectError').text("");
        return true;
    }
}

$('#disciplineSelect').on('change', function () {
    validateDisciplineSelect();
});

// Function to validate role select
function validateDisciplineSelect() {
    var selectedOption = $('#disciplineSelect').val();
    if (!selectedOption) {
        $('#disciplineSelectError').text("Field is required.");
        return false;
    } 
    else {
        $('#disciplineSelectError').removeClass("error");
        return true;
    }
}


$("#submit_Request").click(function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    
    // Perform validation
    var isValid = true;
    isValid = validateWorkArea() && isValid;
    isValid = validatepPrioritySelect() && isValid;
    isValid = validateDisciplineSelect() && isValid;

    // If all validations pass, submit the form
    if (isValid) {
        // Get values from form inputs
        var dateTime = $('#dateTime').val();
        var workArea = $('#workArea').val();
        var priority = $('#prioritySelect').val();
        var departmentId = $('#disciplineSelect').val();
        var description = $('#description').val() ? $('#description').val() : "";
        var qualityCheck = $('#qualityCheck').is(':checked');

        // Create data object to send
        var data = {
            DateAndTime: dateTime,
            WorkArea: workArea,
            Priority: priority,
            DepartmentId: departmentId,
            Description: description,
            QualityCheck: qualityCheck
        };

        // Send AJAX POST request to API controller's register endpoint
        $.ajax({
            url: '/api/ComplaintAPI/CreateComplaint', // Update the URL to match your API controller endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                // Assuming the response contains the complaint number
                var complaintNumber = response.complaintNumber;

                // Update the modal's body with the complaint number
                $("#myModal .modal-body").html(`Thank you for bringing your concerns to our attention. We have received your complaint. Your complaint number is <span>${complaintNumber}</span>.`);

                // Show the modal
                $("#myModal").modal("show");
            },
            error: function (xhr, status, error) {
                // Handle error (you can display error messages or perform other actions)
                console.error(error);
            }
        });

    }
});

function modalClose() {
    $('#dateTime').val('');
    $('#workArea').val('');
    $('#prioritySelect').val('');
    $('#disciplineSelect').val('');
    $('#description').val('');
    $('#qualityCheck').prop('checked', false);

    window.location.href = '/complaints';
}