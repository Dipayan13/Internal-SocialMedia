using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IBS_Intra_App.DAL.Models
{
    public class Event
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string E_Id { get; set; }

        [Required]
        public string Host { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime? Start_Date { get; set; }

        public DateTime? End_Date { get; set; }
        public string? Image { get; set; }

        public string? Description { get; set; }

        [Required]
        public string Status { get; set; } = "Pending";

        [Required]
        public int Yes { get; set; } = 0;

        [Required]
        public int No { get; set; } = 0;

        [ForeignKey("E_Id")]
        public User User { get; set; }
    }
}
