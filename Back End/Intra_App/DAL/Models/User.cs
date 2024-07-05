using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;


namespace IBS_Intra_App.DAL.Models
{
    public class User : IdentityUser
    {
        [Required]
        
        public int Eid { get; set; }

        [Required]
        public string Emp_Name { get; set; }

        [Required]
        public DateTime DOJ { get; set; }

        [Required]
        public DateTime DOB { get; set; }

        public string? Nick_Name { get; set; }

        public string? WhatsApp { get; set; }

        public string? LinkedIn { get; set; }

        [Required]
        public string PMail { get; set; }

        [Required]
        public string WMail { get; set; }

        public string? Image { get; set; }
    }
}
