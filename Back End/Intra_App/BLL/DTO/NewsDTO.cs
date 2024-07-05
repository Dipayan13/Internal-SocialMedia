using IBS_Intra_App.DAL.Models;

namespace IBS_Intra_App.BLL.DTO
{
    public class NewsDTO
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public string? Link { get; set; }


        //dto model conversion
        //model to DTO
        public static NewsDTO ToDto(News model)
        {
            return new NewsDTO
            {
                Title = model.Title,
                Description = model.Description,
                Link = model.Link
            };
        }

        //DTO to model
        public static News UpdateFromDto(NewsDTO dto)
        {
            // Update model properties from DTO as needed.
            return new News
            {
                Title = dto.Title,
                Description = dto.Description,
                Link = dto.Link
            };
        }
    }
}
