using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IBS_Intra_App.DAL.Models
{
    public class NewsActivity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        public string E_Id { get; set; }

        [Required]
        public string N_Id { get; set; }

        //True for Like and False for dislike
        public Boolean Reaction { get; set; }


        [ForeignKey("E_Id")]
        public User User { get; set; }

        [ForeignKey("N_Id")]
        public News News { get; set; }
    }
}
