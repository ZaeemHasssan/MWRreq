//new DataTable('#usersTable');
$(document).ready(function () {

    $('#loader').show();
    $.ajax({
        url: "/api/AuthAPI/GetUsers",
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#loading").remove();

            var table = $('#usersTable').DataTable({
                data: data,
                columns: [
                    { data: "userId" },
                    { data: "fullName" },
                    { data: "email" },
                    { data: "departmentName" },
                    {
                        data: null, // Define custom column for actions
                        render: function (data, type, row) {
                            return '<button class="delete_user_btn text-center" onclick="deleteUser(' + row.userId + ')">Delete User</button>';
                        },
                        className: 'text-center'
                    }
                ],
                columnDefs: [
                    { targets: 0, visible: false }  // Hide the first column (ID) using columnDefs
                ]
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors gracefully (e.g., display error message)
            console.error("Error retrieving users:", textStatus, errorThrown);
            alert("An error occurred while fetching users. Please try again later.");
        },
        complete: function () {
            $('#loader').hide(); // Hide the loader regardless of success or error
        }
    });
});
let userIdToDelete = null;

function deleteUser(userId) {
    userIdToDelete = userId;
    $('#deleteConfirmationModal').modal('show');
}
$('#confirmDeleteBtn').click(function () {
    if (userIdToDelete !== null) {
        $.ajax({
            url: "/api/AuthAPI/DeleteUser/" + userIdToDelete,
            type: "DELETE",
            success: function (result) {
                // Reload the entire page after successful deletion
                location.reload();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error deleting user:", textStatus, errorThrown);
                alert("Failed to delete user. Please try again later.");
            },
            complete: function () {
                $('#deleteConfirmationModal').modal('hide');
            }
        });
    }
});
function closemodal() {
    userIdToDelete = null;
    $('#deleteConfirmationModal').modal('hide');
}













//function deleteUser(userId) {
//    if (confirm('Are you sure you want to delete this user?')) {
//        $.ajax({
//            url: "/api/AuthAPI/DeleteUser/" + userId,
//            type: "DELETE",
//            success: function (result) {
//                // Reload the entire page after successful deletion
//                location.reload();
//            },
//            error: function (jqXHR, textStatus, errorThrown) {
//                console.error("Error deleting user:", textStatus, errorThrown);
//                alert("Failed to delete user. Please try again later.");
//            }
//        });
//    }
//}


