using IBS_Intra_App.BLL.DTO;
using IBS_Intra_App.DAL.Implementation;
using IBS_Intra_App.DAL.Models;
using IBS_Intra_App.Interface;
using System.Security.Cryptography;

namespace IBS_Intra_App.BLL.Service

{
    public class AppService : IAppService
    {
        private readonly IAppImplementation _appImp;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public AppService(IWebHostEnvironment hostingEnvironment, IAppImplementation appImp)
        {
            this._appImp = appImp;
            this._hostingEnvironment = hostingEnvironment;
        }
        /* ----------------------------------------- Profile ---------------------- */
        public List<User> GetEidProfile(string eid)
        {
            var result = _appImp.GetEidProfile(eid);
            return result;
        }

        //remove user
        public async Task<string> Remove_user(string eid)
        {
            string result = await _appImp.Remove_user(eid);
            return result;
        }

        //edit_employee
        public async Task<string> Edit_employee(EditUserModelAdmin userNewDets)
        {
            var result =await _appImp.Edit_employee(userNewDets);
            return result;
        }


        //change_password
        public async Task<string> Edit_password(PwdChangeModel pwds, string id)
        {
            var result =await _appImp.Edit_password(pwds,id);
            return result;
        }

        //edit_profile
        public async Task<string> Edit_profile(EditUserModelUser NewDets,string id)
        {
            var result = await _appImp.Edit_profile(NewDets,id);
            return result;
        }

        public List<User> GetAllUsers()
        {
            var result = _appImp.GetAllUsers();
            return result;
        }

        public List<User> GetBirthdayMonth(string month)
        {
            if (month == "No")
            {
                // Call the implementation to get current month's birthdays
                return _appImp.GetBirthdayMonth(DateTime.Now.Month);
            }
            else if (int.TryParse(month, out int requestedMonth))
            {
                // Call the implementation to get birthdays for the requested month
                return _appImp.GetBirthdayMonth(requestedMonth);
            }
            else
            {
                return new List<User>(); // Return an empty list or handle the error case
            }
        }


        /* ------------------------------------ Dashboard ---------------------- */
        public List<DashBoardModel> DashboardView(string nos,string id)
        {
            try
            {
                DateTime currentDate = DateTime.Today;
                int currentDay = currentDate.Day;
                int currentMonth = currentDate.Month;

                var newsList = _appImp.GetAllNews();
                var eventList = _appImp.GetEidEvents(id);
                var birthday = _appImp.GetBirthdayMonth(currentMonth);

                var todayBirth = birthday.Where(u => u.DOB.Day == currentDay && u.DOB.Month == currentMonth).ToList();

                Console.WriteLine("e", eventList.Count);

                Console.WriteLine("title", newsList.Count());
                var mixedData = newsList
                .Where(a => a != null)
                .Select(a => new DashBoardModel
                {
                    Id = a.Id,
                    birthdays = null,
                    news = a,
                    events = null, // Set to null for ClassA data
                    created = a.P_Date
                })
                .Concat(eventList.Where(b => b != null).Select(b => new DashBoardModel
                {
                    Id = b.Id,
                    birthdays = null,
                    news = null, // Set to null for ClassB data
                    events = b,
                    created = b.Start_Date
                }))
                .Concat(todayBirth.Where(c => c != null).Select(c => new DashBoardModel
                {
                    Id = c.Id,
                    birthdays = c,
                    news = null, // Set to null for ClassB data
                    events = null,
                    created = new DateTime(currentDate.Year, c.DOB.Month, c.DOB.Day, 8, 0, 0)//change the 8 to desired time of birthday to come up
                }))
                .OrderByDescending(m => m.created)
                .Take(Int16.Parse(nos))
                .ToList();
                return mixedData;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }


        

        /* ----------------------------------------- News ---------------------- */
        public string AddNews(NewsDTO nDTO,string id)
        {
            var n = NewsDTO.UpdateFromDto(nDTO);
            n.E_Id = id;
            n.P_Date = DateTime.Now;

            //adding image details to news and storign news image in static folder
            string filePath = null;
            if (nDTO.Image != null && nDTO.Image.Length > 0)
            {
                // Generate a unique file name
                var uniqueFileName = n.Title + "_" + nDTO.Image.FileName;
                // Define the file path where you want to store the uploaded file
                var uploadsFolderPath = Path.Combine(_hostingEnvironment.ContentRootPath, "StaticFiles/NewsImages"); // Change to your preferred storage path
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }
                var filePathOnServer = Path.Combine(uploadsFolderPath, uniqueFileName);

                using (var fileStream = new FileStream(filePathOnServer, FileMode.Create))
                {
                    nDTO.Image.CopyTo(fileStream);
                }

                // Set the file path or URL in your user database
                filePath = "StaticFiles/NewsImages/" + uniqueFileName; // Assuming you store a relative path
            }
            n.Image = filePath;
            var result = _appImp.AddNews(n);
            return result;
        }
        public List<News> GetAllNews()
        {
            var result = _appImp.GetAllNews();
            return result;
        }
        public List<News> GetEidNews(string eid)
        {
            var result = _appImp.GetEidNews(eid);
            return result;
        }

        public List<News> GetNewsDetails(string news_id)
        {
            var result = _appImp.GetNewsDetails(news_id);
            return result;
        }

        /* ----------------------------------------- Events ---------------------- */
        public string AddEvents(EventDTO eDTO, string id, string role)
        {
            var result = _appImp.AddEvents(eDTO, id, role);
            return result;
        }

        public List<Event> GetEidEvents(string eid)
        {
            var result = _appImp.GetEidEvents(eid);
            return result;
        }

        public string UpdateAtendeStatus(string status,string id, string event_id)
        {
            var result = _appImp.UpdateAtendeStatus(status, id,event_id);
            return result;
        }

        public string UpdateEventStatus(string status,string event_id)
        {
            var result = _appImp.UpdateEventStatus(status, event_id);
            return result;
        }

        public List<Event> Approvals(string status)
        {
            var result = _appImp.Approvals(status);
            return result;
        }

        public List<User> GetParticipants(string event_id, string status)
        {
            var result = _appImp.GetParticipants(event_id,status);
            return result;
        }


        /* ----------------------------------------- ReactionTONews ---------------------- */
        public string React_to_news(string news_id, bool reaction, string id)
        {
            try
            {
                var result = _appImp.ReactToNews(news_id, reaction, id);
                return result;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public ReactionList NewsReactionList(string news_id)
        {
            try
            {
                var result = _appImp.NewsReactionList(news_id);
                return result;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}