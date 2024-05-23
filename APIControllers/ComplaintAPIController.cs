using FFnF_Request.Models;
using FFnF_Request.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFnF_Request.APIControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintAPIController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public ComplaintAPIController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpPost("CreateComplaint")]
        public IActionResult CreateComplaint(ComplaintFormVM model)
        {
            // Retrieve the UserID cookie from the request
            string userId = Request.Cookies["UserID"];
            try
            {
                if (userId != null)
                {
                    // Generate the complaint number
                    Random random = new Random();
                    string complaintNumber;
                    complaintNumber = "MWR-" + random.Next(10000000, 99999999).ToString();

                    Complaint obj = new Complaint();
                    obj.ComplaintNumber = complaintNumber;
                    obj.Status = "Open";
                    obj.Description = model.Description;
                    obj.Priority = model.Priority;
                    obj.WorkArea = model.WorkArea;
                    obj.UserId = Convert.ToInt32(userId);
                    obj.SentToDepartmentId = model.DepartmentId;
                    obj.QualityCheck = model.QualityCheck;
                    DateTime now = DateTime.Now;
                    string formattedDate = now.ToString("M-d-yyyy h:mm tt");
                    obj.CreatedAt = formattedDate;

                    _context.Complaints.Add(obj);
                    _context.SaveChanges();

                    return Ok(new { ComplaintNumber = complaintNumber });
                }
                else
                {
                    return StatusCode(500, $"User is not logged In");
                }

            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate response
                return StatusCode(500, $"An error occurred while logging in: {ex.Message}");
            }
        }

        [HttpPut("CloseComplaint")]
        public async Task<IActionResult> CloseComplaint(ComplaintFormVM data)
        {
            try
            {
                var closeComplaint = await _context.Complaints.FirstOrDefaultAsync(c => c.ComplaintNumber == data.ComplaintNumber);

                if (closeComplaint == null)
                {
                    return NotFound("Error");
                }
                closeComplaint.Status = data.Status;

                var attachment = await _context.ComplaintAttachments
                                       .FirstOrDefaultAsync(a => a.ComplaintId == closeComplaint.ComplaintId);

                if (attachment == null)
                {
                    var obj = new ComplaintAttachment();

                    obj.ReasonForClosure = data.ReasonForClosure;
                    obj.ComplaintId = closeComplaint.ComplaintId;
                    DateTime now = DateTime.Now;
                    string formattedDate = now.ToString("M-d-yyyy h:mm tt");
                    obj.CloseAt = formattedDate;
                    _context.Complaints.Update(closeComplaint);
                    _context.ComplaintAttachments.Add(obj);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Increment the reclose count and update dates
                    attachment.ReCloseCount++;
                    string currentDateTime = DateTime.Now.ToString("M-d-yyyy h:mm tt");
                    attachment.ReCloseAt = currentDateTime; // first reclose date
                    attachment.ReCloseDates += currentDateTime;
                    _context.ComplaintAttachments.Update(attachment);
                    _context.Complaints.Update(closeComplaint);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error closing complaint: {ex.Message}"); // Log the error for debugging
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPut("ResetComplaint")]
        public async Task<IActionResult> ResetComplaint(ComplaintFormVM data)
        {
            try
            {
                var complaint = await _context.Complaints.FirstOrDefaultAsync(c => c.ComplaintNumber == data.ComplaintNumber);
                if (complaint == null)
                {
                    return NotFound(new { message = "Complaint not found" });
                }

                // Update the complaint status to "reopened"
                complaint.Status = "ReOpened";

                // Find the attachment related to the complaint
                var attachment = await _context.ComplaintAttachments
                                               .FirstOrDefaultAsync(a => a.ComplaintId == complaint.ComplaintId);
                if (attachment == null)
                {
                    return NotFound(new { message = "Attachment not found" });
                }

                // Increment the reopen count and update dates
                attachment.ReOpenCount++;
                string currentDateTime = DateTime.Now.ToString("M-d-yyyy h:mm tt");
                attachment.ReOpenAt = currentDateTime; // first reopen date
                attachment.ReopenDates += currentDateTime;
                _context.ComplaintAttachments.Update(attachment);
                await _context.SaveChangesAsync();







                return Ok(new { message = "Complaint reopened successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error resetting complaint: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost("GetSentComplaints")]
        public IActionResult GetSentComplaints()
        {
            try
            {
                // Retrieve the UserID cookie from the request
                string userId = Request.Cookies["UserID"];

                //var getData = _context.Complaints
                //                 .Where(u => u.UserId == Convert.ToInt32(userId))
                //                 .ToList();

                var getData = (from c in _context.Complaints
                               join d in _context.Departments on c.SentToDepartmentId equals d.DepartmentId
                               where c.UserId == Convert.ToInt32(userId) && (c.Status == "Open" || c.Status == "ReOpened")
                               select new
                               {
                                   c.UserId,
                                   c.SentToDepartmentId,
                                   DepartmentName = d.DepartmentName,
                                   c.ComplaintNumber,
                                   c.Status,
                                   c.Description,
                                   c.Priority,
                                   c.WorkArea,
                                   c.QualityCheck,
                                   c.CreatedAt
                               }).ToList();
                return Ok(getData);
            }
            catch (Exception)
            {

                throw;
            }

        }

        [HttpPost("GetMyComplaintsSolved")]
        public IActionResult GetMyComplaintsSolved()
        {
            try
            {
                // Retrieve the UserID cookie from the request
                string userId = Request.Cookies["UserID"];

                //var getData = _context.Complaints
                //                 .Where(u => u.UserId == Convert.ToInt32(userId))
                //                 .ToList();

                var getData = (from c in _context.Complaints
                               join d in _context.Departments on c.SentToDepartmentId equals d.DepartmentId
                               join e in _context.ComplaintAttachments on c.ComplaintId equals e.ComplaintId
                               where c.UserId == Convert.ToInt32(userId) && (c.Status == "Close" || c.Status == "Resolved")
                               select new
                               {
                                   c.UserId,
                                   c.SentToDepartmentId,
                                   DepartmentName = d.DepartmentName,
                                   c.ComplaintNumber,
                                   c.Status,
                                   c.Description,
                                   c.Priority,
                                   c.WorkArea,
                                   c.QualityCheck,
                                   e.CloseAt
                               }).ToList();
                return Ok(getData);
            }
            catch (Exception)
            {

                throw;
            }

        }

        [HttpPost("GetIncommingComplaints")]
        public async Task<IActionResult> GetIncommingComplaints()
        {
            try
            {
                // Retrieve the UserID cookie from the request
                string userIdString = Request.Cookies["UserID"];

                if (string.IsNullOrEmpty(userIdString))
                {
                    return BadRequest("UserID cookie not found");
                }

                int userId;
                if (!int.TryParse(userIdString, out userId))
                {
                    return BadRequest("Invalid UserID format");
                }

                // Fetch department ID associated with the user
                var userDepartment = await _context.Users
                    .Where(u => u.UserId == userId)
                    .Select(u => u.DepartmentId)
                    .FirstOrDefaultAsync();

                if (userDepartment == null)
                {
                    return NotFound("User not found or department not assigned");
                }

                // Filter complaints based on senttodepartment ID (assuming senttodepartment is a foreign key to Department)
                //var incomingComplaints = await _context.Complaints
                //    .Where(c => c.SentToDepartmentId == userDepartment && c.Status == "Open")
                //    .ToListAsync();

                var incomingComplaints = await (from c in _context.Complaints
                                                join u in _context.Users on c.UserId equals u.UserId
                                                join d in _context.Departments on u.DepartmentId equals d.DepartmentId
                                                where c.SentToDepartmentId == userDepartment && (c.Status == "Open" || c.Status == "ReOpened")
                                                select new
                                                {
                                                    c.ComplaintId,
                                                    c.ComplaintNumber,
                                                    c.Description,
                                                    c.WorkArea,
                                                    c.Priority,
                                                    c.QualityCheck,
                                                    c.Status,
                                                    c.CreatedAt,
                                                    SenderDepartmentName = d.DepartmentName // Assuming Department table has a Name field
                                                }).ToListAsync();

                return Ok(incomingComplaints);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving incoming complaints: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost("GetIncommingSolvedComplaints")]
        public async Task<IActionResult> GetIncommingSolvedComplaints()
        {
            try
            {
                // Retrieve the UserID cookie from the request
                string userIdString = Request.Cookies["UserID"];

                if (string.IsNullOrEmpty(userIdString))
                {
                    return BadRequest("UserID cookie not found");
                }

                int userId;
                if (!int.TryParse(userIdString, out userId))
                {
                    return BadRequest("Invalid UserID format");
                }

                // Fetch department ID associated with the user
                var userDepartment = await _context.Users
                    .Where(u => u.UserId == userId)
                    .Select(u => u.DepartmentId)
                    .FirstOrDefaultAsync();

                if (userDepartment == null)
                {
                    return NotFound("User not found or department not assigned");
                }

                // Filter complaints based on senttodepartment ID (assuming senttodepartment is a foreign key to Department)
                var incomingComplaints = await _context.Complaints
                    .Where(c => c.SentToDepartmentId == userDepartment && (c.Status == "Close" || c.Status == "Resolved"))
                    .ToListAsync();
                var incomingSolvedComplaints = await (from c in _context.Complaints
                                                      join u in _context.Users on c.UserId equals u.UserId
                                                      join d in _context.Departments on u.DepartmentId equals d.DepartmentId
                                                      join e in _context.ComplaintAttachments on c.ComplaintId equals e.ComplaintId
                                                      where c.SentToDepartmentId == userDepartment && (c.Status == "Close" || c.Status == "Resolved")
                                                      select new
                                                      {
                                                          c.ComplaintId,
                                                          c.ComplaintNumber,
                                                          c.Description,
                                                          c.WorkArea,
                                                          c.Priority,
                                                          c.QualityCheck,
                                                          c.Status,
                                                          c.CreatedAt,
                                                          e.CloseAt,
                                                          SenderDepartmentName = d.DepartmentName // Assuming Department table has a Name field
                                                      }).ToListAsync();
                return Ok(incomingSolvedComplaints);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving incoming complaints: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }



    }
}
