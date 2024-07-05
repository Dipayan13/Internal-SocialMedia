using IBS_Intra_App.DAL.Models;

namespace IBS_Intra_App.BLL.DTO
{
    public class EventDTO
    {
        public string Title { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string? Description { get; set; }

        public List<string> event_participants { get; set; }

        //dto conversion
        //model to DTO
        public static EventDTO ToDto(Event model)
        {
            return new EventDTO
            {
                Title = model.Title,
                Start_Date = model.Start_Date,
                End_Date = model.End_Date,
                Description = model.Description,
            };
        }

        //DTO to Model
        public static Event UpdateFromDto(EventDTO dto)
        {
            // Update model properties from DTO as needed.
            return new Event
            {
                Title = dto.Title,
                Start_Date = dto.Start_Date,
                End_Date = dto.End_Date,
                Description = dto.Description
            };
        }
    }


}
