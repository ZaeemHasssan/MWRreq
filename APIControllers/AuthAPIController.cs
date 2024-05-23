using FFnF_Request.Models;
using FFnF_Request.Services;
using FFnF_Request.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FFnF_Request.APIControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthAPIController : ControllerBase
    {
        private readonly ApplicationContext _context;
        private readonly JWTService _jwtService;

        public AuthAPIController(ApplicationContext context, JWTService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpGet("IsAdmin")]
        public async Task<IActionResult> IsAdmin()
        {
            try
            {
                // Retrieve the UserID cookie from the request
                string userIdString = Request.Cookies["UserID"];

                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    return BadRequest("Invalid UserID.");
                }

                // Check if the user has the admin role
                var isAdmin = await _context.Users
                    .Include(u => u.Role)
                    .AnyAsync(u => u.UserId == userId && u.Role.RoleName == "SuperAdmin");

                return Ok(new { IsAdmin = isAdmin });
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate response
                return StatusCode(500, $"An error occurred while checking admin role: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        public IActionResult Login(LoginUserVM loginObj)
        {
            try
            {
                // Find user by username and password
                var user = _context.Users.FirstOrDefault(u => u.Email == loginObj.Email && u.Password == loginObj.Password);

                if (user == null)
                {
                    // User not found, return a not found response
                    return StatusCode(200, $"User Not Found");
                }
                // User found, generate JWT token
                var token = _jwtService.GenerateToken(user.UserId);

                // Set the cookie options
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddDays(30), // Expires in 30 days
                    HttpOnly = false, // You can change this as needed
                    Secure = true, // Set to true if your site is served over HTTPS
                    SameSite = SameSiteMode.None // Adjust this as needed
                };

                // Add the user ID to the response cookie
                Response.Cookies.Append("UserID", user.UserId.ToString(), cookieOptions);
                Response.Cookies.Append("Email", user.Email, cookieOptions);

                // Add the token to the response cookie
                Response.Cookies.Append("Token", token, cookieOptions);

                // Return success response with token
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate response
                return StatusCode(500, $"An error occurred while logging in: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(User obj)
        {
            try
            {
                // Check if a user with the same name and password  already exists
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == obj.Email && u.Password == obj.Password);
               
                if (existingUser != null)
                {
                    return Conflict("Username already exists.");
                }
                // Check if a user with the same department ID already exists, unless the department ID is 9
                if (obj.DepartmentId != 9)
                {
                    var existingDepartmentUser = _context.Users.FirstOrDefault(u => u.DepartmentId == obj.DepartmentId);
                    if (existingDepartmentUser != null)
                    {
                        return Conflict("User already exists.");
                    }
                }
                // If no user with the same name and password exists, add the new user
                _context.Users.Add(obj);
                await _context.SaveChangesAsync();

                return Ok("User registered successfully.");

            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate response
                return StatusCode(500, $"An error occurred while registering the user: {ex.Message}");
            }
        }

        [HttpGet("GetCookiesData")]
        public ActionResult GetCookiesData()
        {
            try
            {
                // Retrieve the UserID cookie from the request
                string userIdCookie = Request.Cookies["UserID"];

                // Retrieve the UserID cookie from the request
                string userEmailCookie = Request.Cookies["Email"];

                // Retrieve the Token cookie from the request
                string tokenCookie = Request.Cookies["Token"];

                if (string.IsNullOrEmpty(userIdCookie) || string.IsNullOrEmpty(tokenCookie))
                {
                    // If either cookie is not found or empty, return an error response
                    return BadRequest("User ID or token cookie not found or empty.");
                }

                // Here, you can use userId and token as needed
                // For demonstration, I'll return them as a new object
                var user = new
                {
                    UserId = userIdCookie,
                    Email = userEmailCookie,
                    Token = tokenCookie
                };

                // Return the user data
                return Ok(user);
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate response
                return StatusCode(500, $"An error occurred while retrieving user data: {ex.Message}");
            }
        }

        [HttpGet("GetUsers")]
        public async Task<ActionResult<IEnumerable<AllUsersVM>>> GetUsers()
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted && u.Role.RoleName == "user")
                .Select(u => new AllUsersVM
                {
                    UserId = u.UserId,
                    FullName = u.FirstName + " " + u.LastName,
                    Email = u.Email,
                    DepartmentName = u.Department.DepartmentName,
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword(string[] data)
        {
            try
            {
                // Access data from the array elements
                var email = data[0];
                var oldPassword = data[1];
                var newPassword = data[2];
                // Find user by email (or username)
                var user = _context.Users.FirstOrDefault(u => u.Email == email && u.Password == oldPassword);

                if (user == null)
                {
                    // User not found, return a not found response
                    return BadRequest("Invalid old password.");
                }

                // Update user's password with the new password
                user.Password = newPassword;

                // Save changes to the database
                _context.SaveChanges();

                // Return success response
                return Ok("Password changed successfully.");
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate response
                return StatusCode(500, $"An error occurred while changing password: {ex.Message}");
            }
        }

        [HttpDelete("DeleteUser/{id}")]
        public IActionResult DeleteUser(int id)
        {
            // Implement your deletion logic here
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok();
        }



        [HttpPost("Signout")]
        public async Task<IActionResult> Signout()
        {
            // Remove all cookies
            Response.Cookies.Delete("UserID");
            Response.Cookies.Delete("Email");
            Response.Cookies.Delete("Token");
            return RedirectToAction("Login", "Auth");
        }
    }
}
