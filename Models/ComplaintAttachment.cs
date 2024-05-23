#nullable disable
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FFnF_Request.Models
{
    public class ComplaintAttachment
    {
        // Foreign key property
        [Key]
        public int ComplaintAttachmentsId { get; set; }
        public string ReasonForClosure { get; set; }
        public string ImageURL { get; set; }
        public string CloseAt { get; set; }
        public int ReOpenCount { get; set; }
        public int ReCloseCount { get; set; }
        public string ReOpenAt { get; set; }
        public string ReCloseAt { get; set; }
        public string ReopenDates { get; set; }
        public string ReCloseDates { get; set; }

        // Foreign key property
        [ForeignKey("Complaint")]
        public int ComplaintId { get; set; }
    }
}
