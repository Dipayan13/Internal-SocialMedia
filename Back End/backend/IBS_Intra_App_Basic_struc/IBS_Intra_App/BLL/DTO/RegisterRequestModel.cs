namespace IBS_Intra_App.BLL.DTO
{
    public enum Roles
    {
        Admin,
        Executive,
        User
    }
    public class RegisterRequestModel
    {
        public int Eid { get; set; }
        public string Emp_Name { get; set; }

        public string role { get; set; }
        public DateTime DOJ { get; set; }
        public DateTime DOB { get; set; }
        public long phoneNumber { get; set; }
        public string? Nick_Name { get; set; }
        public string? WhatsApp { get; set; }
        public string? LinkedIn { get; set; }
        public string? PMail { get; set; }
        public string? WMail { get; set; }
        public IFormFile? Image { get; set; }
        public string Password { get; set; }
    }
}
