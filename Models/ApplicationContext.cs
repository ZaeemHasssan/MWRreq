using Microsoft.EntityFrameworkCore;

namespace FFnF_Request.Models
{
    public class ApplicationContext: DbContext
    {
        public ApplicationContext(DbContextOptions options): base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<ComplaintAttachment> ComplaintAttachments { get; set; }
    }
}
