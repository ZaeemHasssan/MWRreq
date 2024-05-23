#nullable disable
namespace FFnF_Request.ViewModels
{
    public class ComplaintAttachmentVM
    {
        // Foreign key property
        public string ReasonForClosure { get; set; }
        public string ImageURL { get; set; }
        public int ReopenCount { get; set; }
        public string ReopenAt { get; set; }
    }
}
