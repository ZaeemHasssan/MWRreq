#nullable disable
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FFnF_Request.Models
{
    public class Complaint
    {
        [Key]
        public int ComplaintId { get; set; }
        public string ComplaintNumber { get; set; }
        public string Description { get; set; }
        public string WorkArea { get; set; }
        public string Priority { get; set; }
        public bool QualityCheck { get; set; }
        public string Status { get; set; }
        public int SentToDepartmentId { get; set; }
        public string CreatedAt { get; set; }
        public string ClosedAt { get; set; }
        // Foreign key property
        [ForeignKey("User")]
        public int UserId { get; set; }
        public ComplaintAttachment ComplaintAttachment { get; set; }
    }
}
