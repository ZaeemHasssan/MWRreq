#nullable disable
using System.ComponentModel.DataAnnotations;

namespace FFnF_Request.Models
{
    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }
}
