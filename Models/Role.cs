#nullable disable
using System.ComponentModel.DataAnnotations;

namespace FFnF_Request.Models
{
    public class Role
    {
        [Key]
         public int RoleId { get; set; }
         public string RoleName { get; set; }
    }
}
