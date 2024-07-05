using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IBS_Intra_App.DAL.Models
{
    public class News
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string E_Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public string? Image { get; set; }

        [Required]
        public DateTime P_Date { get; set; }

        public string? Link { get; set; }

        [ForeignKey("E_Id")]
        public User User { get; set; }
    }
}
