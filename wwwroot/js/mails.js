$(document).ready(function () {
    getSentComplaints();
});

$('#active-queries-tab').on('click', function () {
    getSentComplaints();
});
$('#resolved-queries-tab').on('click', function () {
    getSentSolvedComplaints();
});
$('#active-requests-tab').on('click', function () {
    getIncommingComplaints();
});
$('#resolved-requests-tab').on('click', function () {
    getIncommingSolvedComplaints();
});
//region my complaints tab
//#region 
function getSentComplaints() {
    $('#loader').show();
    $.ajax({
        url: "/api/ComplaintAPI/GetSentComplaints", // Replace with your actual API endpoint
        type: "POST",
        dataType: "json",
        success: function (data) {
            $("#NoRecords").remove();
            $("#active-queries").empty();

            if (data.length != 0) {
                // Loop through the fetched data and create HTML elements
                $.each(data, function (index, item) {
                    var complaintNo = item.complaintNumber;
                    var dateTime = item.createdAt;
                    var description = item.description;
                    var priority = item.priority;
                    var status = item.status;
                    var workArea = item.workArea;
                    var SentTo = item.departmentName;

                    var html = ` <div class="row table_row">
                                <div class="col-md-3 comp_det_box">
                                <div class="comp_det">
                                  <div><span>Complaint No: </span> ${complaintNo}</div>
                                  <div><span>Priority: </span>${priority}</div>
                                  <div><span>Lodged On: </span>${dateTime}</div>
                                  </div>
                                </div>
                                <div class="col-md-7 comp_Des">
                                <div><span class="heading">To: </span>${SentTo}</div>
                                <div><span class="heading">Work Area: </span>${workArea}</div>
                                <div class="description-container">
                                <span class="heading">Issue: ${description}</span>
                                </div>
                                </div>
                                <div class="col-md-2 comp_close_btn">nobtn</div>
                              </div>`;

                    $("#active-queries").append(html);

                });
            } else {
                $("#active-queries").empty();
                $("#active-queries").after('<div class="no_record_box" id="NoRecords">No Records Found</div>');
            }
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
}
//#endregion

//region get sent complaints solved tab
//#region
// Show loading indicator while fetching users (optional)
function getSentSolvedComplaints() {
    $('#loader').show();

    $.ajax({
        url: "/api/ComplaintAPI/GetMyComplaintsSolved", // Replace with your actual API endpoint
        type: "POST",
        dataType: "json",
        success: function (data) {
            $("#NoRecords").remove();
            $("#resolved-queries").empty();

            if (data.length != 0) {
                // Loop through the fetched data and create HTML elements
                $.each(data, function (index, item) {
                    var complaintNo = item.complaintNumber;
                    var dateTime = item.closeAt;
                    var description = item.description;
                    var priority = item.priority;
                    var status = item.status;
                    var workArea = item.workArea;
                    var SentToDepartment = item.departmentName;

                    var html = ` <div class="row table_row">
                                        <div class="col-md-3 comp_det_box">
                                        <div class="comp_det">
                                          <div><span>Complaint No: </span> ${complaintNo}</div>
                                          <div><span>Status: </span>${status}</div>
                                          <div><span>Closed On: </span>${dateTime}</div>
                                          </div>
                                        </div>
                                        <div class="col-md-7 comp_Des">
                                        <div><span class="heading">To: </span>${SentToDepartment}</div>
                                        <div><span class="heading">Work Area: </span>${workArea}</div>
                                        <div class="description-container">
                                        <span class="heading">Issue: ${description}</span>
                                         
                                        </div>
                                        </div>
                                        <div class="col-md-2 comp_close_btn"><button class="reset-complaint-btn" id="reset-`+ complaintNo + `"  data-complaint-number="${complaintNo}">Reset</button></div>
                                      </div>`;

                    $("#resolved-queries").append(html);

                    //open model on close button
                    $('#reset-' + complaintNo + '').on('click', function (e) {

                        // Create modal HTML
                        var modalHtml = ` <div class="modal fade custom-modal" id="dynamicModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Close Complaint</h5>
                                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                  <span aria-hidden="true">&times;</span>
                                                </button>
                                              </div>
                                              <div class="modal-body">
                                               <span>Are you sure to make this compaint again.?</span>
                                              </div>
                                              <div class="modal-footer">
                                                <button type="button" onclick="resetSubmit('${complaintNo}')" class="btn btn-primary">Yes</button>
                                                <button type="button" onclick="modalSubmit('${complaintNo}')" class="btn btn-primary">No</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>`;
                        // Append modal HTML to the body
                        $('body').append(modalHtml);

                        $("#dynamicModal").modal("show");
                        //after opening model make default values empty


                    });


                });
            } else {
                $("#active-queries").empty();
                $("#active-queries").after('<div class="no_record_box" id="NoRecords">No Records Found</div>');
            }

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
}
function resetSubmit(complaintNo) {
    var complaintNo = complaintNo;

    // Create data object to send
    var data = {
        ComplaintNumber: complaintNo
    };

    $.ajax({
        url: "/api/ComplaintAPI/ResetComplaint",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data) {
            $("#resolved-queries").empty();
            $("#dynamicModal").modal("hide");
            getSentSolvedComplaints();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors gracefully (e.g., display error message)
            console.error("Error retrieving users:", textStatus, errorThrown);
            alert("An error occurred while fetching users. Please try again later.");
        }
    });
}
//#endregion

//region get incomming complaints tab
//#region 
// Show loading indicator while fetching users (optional)
function getIncommingComplaints() {
    $('#loader').show();
    $.ajax({
        url: "/api/ComplaintAPI/GetIncommingComplaints", // Replace with your actual API endpoint
        type: "POST",
        dataType: "json",
        success: function (data) {
            $("#NoRecords").remove();
            $("#active-requests").empty();

            if (data != 0) {
                // Loop through the fetched data and create HTML elements
                $.each(data, function (index, item) {
                    var complaintNo = item.complaintNumber;
                    var dateTime = item.createdAt;
                    var description = item.description;
                    var priority = item.priority;
                    var status = item.status;
                    var workArea = item.workArea;
                    var SenderDepartment = item.senderDepartmentName;

                    var html = ` <div class="row table_row">
                                        <div class="col-md-3 comp_det_box">
                                        <div class="comp_det">
                                          <div><span>Complaint No: </span> ${complaintNo}</div>
                                          <div><span>Priority: </span>${priority}</div>
                                          <div><span>Lodged On: </span>${dateTime}</div>
                                          </div>
                                        </div>
                                        <div class="col-md-7 comp_Des">
                                        <div><span class="heading">From: </span>${SenderDepartment}</div>
                                        <div><span class="heading">Work Area: </span>${workArea}</div>
                                        <div class="description-container">
                                        <span class="heading">Issue: ${description}</span>
                                        </div>
                                        </div>
                                        <div class="col-md-2 comp_close_btn"><button class="close-complaint-btn" id="closeBtn-`+ complaintNo + `"  data-complaint-number="${complaintNo}">Close</button></div>
                                      </div>`;

                    $("#active-requests").append(html);

                    //open model on close button
                    $('#closeBtn-' + complaintNo + '').on('click', function (e) {

                        // Create modal HTML
                        var modalHtml = ` <div class="modal fade custom-modal" id="dynamicModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Close Complaint</h5>
                                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                  <span aria-hidden="true">&times;</span>
                                                </button>
                                              </div>
                                              <div class="modal-body">
                                                <div class="form-group">
                                                  <div class="checkbox-labels">
                                                    <input type="checkbox" value="Close" id="resolved-`+ complaintNo + `">
                                                    <label for="resolved">Resolved</label>
                                                  </div>
                                                  <div class="checkbox-labels">
                                                    <input type="checkbox" value="other" id="other-`+ complaintNo + `">
                                                    <label for="other">Other</label>
                                                  </div>
                                                   <span id="roleError" class="error"></span>
                                                </div>
                                                <div class="close_req_textarea">
                                                  <textarea id="closeReasonInput-`+ complaintNo + `" class="form-control" placeholder="Reason (if any...)"></textarea>
                                                </div>
                                              </div>
                                              <div class="modal-footer">
                                                <button type="button" onclick="modalSubmit('${complaintNo}')" class="btn btn-primary">Submit</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>`;
                        // Append modal HTML to the body
                        $('body').append(modalHtml);

                        $("#dynamicModal").modal("show");
                        //after opening model make default values empty
                        $('#closeReasonInput-' + complaintNo).val('');
                        $('#closeReasonInput-' + complaintNo).prop('disabled', true);
                        var Resolved = document.getElementById('resolved-' + complaintNo);
                        var Other = document.getElementById('other-' + complaintNo);
                        Resolved.checked = false;
                        Other.checked = false;

                        $('#resolved-' + complaintNo).on('click', function (e) {
                            // Get the checkbox
                            var Resolved = document.getElementById('resolved-' + complaintNo);
                            var Other = document.getElementById('other-' + complaintNo);
                            // If the checkbox is checked, display the output text
                            if (Resolved.checked) {
                                Other.checked = false;
                                $('#closeReasonInput-' + complaintNo).val('');
                                $('#closeReasonInput-' + complaintNo).prop('disabled', true);
                            }

                        });

                        $('#other-' + complaintNo + '').on('click', function (e) {
                            // Get the checkbox
                            var Resolved = document.getElementById('resolved-' + complaintNo);
                            var Other = document.getElementById('other-' + complaintNo);
                            // If the checkbox is checked, display the output text
                            if (Other.checked) {
                                Resolved.checked = false;
                                $('#closeReasonInput-' + complaintNo).prop('disabled', false);
                            } else if (!Other.checked) {
                                $('#closeReasonInput-' + complaintNo).val('');
                                $('#closeReasonInput-' + complaintNo).prop('disabled', true);
                            }
                        });

                    });

                });
            } else {
                $("#resolved-requests").empty();
                $("#resolved-requests").after('<div  class="no_record_box" id="NoRecords">No Records Found</div>');
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors gracefully (e.g., display error message)
            console.error("Error retrieving users:", textStatus, errorThrown);
            alert("An error occurred while fetching users. Please try again later.");
        },
        complete: function () {
            $('#loader').hide();
        }
    });
};
function modalSubmit(complaintNo) {
    var Resolved = document.getElementById('resolved-' + complaintNo).checked;
    var Other = document.getElementById('other-' + complaintNo).checked;
    var status = Resolved ? "Resolved" : "Close";
    var closereason = $('#closeReasonInput-' + complaintNo).val();
    var complaintNo = complaintNo;

    // Create data object to send
    var data = {
        ComplaintNumber: complaintNo,
        Status: status,
        ReasonForClosure: closereason
    };
    if (Resolved || Other) {
        $.ajax({
            url: "/api/ComplaintAPI/CloseComplaint",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data) {
                $("#active-requests").empty();
                getIncommingComplaints();
                $("#dynamicModal").modal("hide");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors gracefully (e.g., display error message)
                console.error("Error retrieving users:", textStatus, errorThrown);
                alert("An error occurred while fetching users. Please try again later.");
            }
        });
    } else {
        $("#roleError").text("Please select at least one option.")
       
    }
   
}
//#endregion


//region get incomming complaints solved tab
//#region 
// Show loading indicator while fetching users (optional)
function getIncommingSolvedComplaints() {
    $('#loader').show();
    $.ajax({
        url: "/api/ComplaintAPI/GetIncommingSolvedComplaints", // Replace with your actual API endpoint
        type: "POST",
        dataType: "json",
        success: function (data) {
            $("#NoRecords").remove();
            $("#resolved-requests").empty();

            if (data.length != 0) {
                // Loop through the fetched data and create HTML elements
                $.each(data, function (index, item) {
                    var complaintNo = item.complaintNumber;
                    var dateTime = item.closeAt;
                    var description = item.description;
                    var priority = item.priority;
                    var status = item.status;
                    var workArea = item.workArea;
                    var SenderDepartment = item.senderDepartmentName;

                    var html = ` <div class="row table_row">
                                        <div class="col-md-3 comp_det_box">
                                        <div class="comp_det">
                                          <div><span>Complaint No: </span> ${complaintNo}</div>
                                          <div><span>Status: </span>${status}</div>
                                          <div><span>Closed On: </span>${dateTime}</div>
                                          </div>
                                        </div>
                                        <div class="col-md-7 comp_Des">
                                        <div><span class="heading">From: </span>${SenderDepartment}</div>
                                        <div><span class="heading">Work Area: </span>${workArea}</div>
                                        <div class="description-container">
                                        <span class="heading">Issue: ${description}</span>
                                        </div>
                                        </div>
                                        <div class="col-md-2 comp_close_btn">no btn</div>
                                      </div>`;

                    $("#resolved-requests").append(html);
                });
            }
            else {
                $("#resolved-requests").empty();
                $("#resolved-requests").before('<div class="no_record_box" id="NoRecords">No Records Found</div>');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors gracefully (e.g., display error message)
            console.error("Error retrieving users:", textStatus, errorThrown);
            alert("An error occurred while fetching users. Please try again later.");
        },
        complete: function () {
            $('#loader').hide();
        }
    });
};
//#endregion






