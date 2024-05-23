#nullable disable
namespace FFnF_Request.ViewModels
{
    public class ComplaintFormVM
    {
        public string ComplaintNumber { get; set; }
        public string DateAndTime { get; set; }
        public string WorkArea { get; set; }
        public string Priority { get; set; }
        public int DepartmentId { get; set; }
        public string Description { get; set; }
        public string SentToDepartment { get; set; }
        public string SentByDepartment { get; set; }
        public bool QualityCheck { get; set; }
        public string ReasonForClosure { get; set; }
        public string Status { get; set; }
        public string ImageURL { get; set; }
        public int ReopenCount { get; set; }
        public string ReCreatedAt { get; set; }
        public string CloseAt { get; set; }
    }
}
