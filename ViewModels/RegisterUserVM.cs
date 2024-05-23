#nullable disable
namespace FFnF_Request.ViewModels
{
    public class RegisterUserVM
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int DepartmentId { get; set; }
        public bool RoleId { get; set; }
    }
}
