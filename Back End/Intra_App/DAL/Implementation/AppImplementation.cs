using IBS_Intra_App.BLL.DTO;
using IBS_Intra_App.DAL.Context;
using IBS_Intra_App.DAL.Models;
using IBS_Intra_App.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace IBS_Intra_App.DAL.Implementation

{
    public class AppImplementation : IAppImplementation
    {
        public readonly ApplicationDbContext _context;
        private readonly UserManager<User> userManager;
        private readonly IWebHostEnvironment _hostingEnvironment;
        //public readonly DataContext _cont;

        public AppImplementation(IWebHostEnvironment hostingEnvironment, ApplicationDbContext context, UserManager<User> userManager)
        {
            this._context = context;
            this.userManager = userManager;
            this._hostingEnvironment = hostingEnvironment;
        }
        /* ----------------------------------------- Profile ---------------------- */
        public List<User> GetEidProfile(string eid)
        {
            try
            {
                var EID = Int16.Parse(eid);
                var result = _context.Users.Where(_a => _a.Eid == EID).ToList();
                Console.WriteLine(result);
                if (result.Count != 0)
                {
                    return result;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        //remove User
        public async Task<string> Remove_user(string eid)
        {
            var EID = Int16.Parse(eid);
            var user = _context.Users.FirstOrDefault(c => c.Eid== EID);
            if(user != null)
            {
                //remove the role
                var roles = await userManager.GetRolesAsync(user);
                await userManager.RemoveFromRoleAsync(user, roles.First());
                //removing the linked news
                var userNews = _context.News.Where(n => n.E_Id == user.Id).ToList();
                _context.News.RemoveRange(userNews);
                //removing the linked events
                var userEvents = _context.Events.Where(e => e.E_Id == user.Id).ToList();
                _context.Events.RemoveRange(userEvents);

                //deleteing the user
                var res = await userManager.DeleteAsync(user);
                _context.SaveChanges();
                if (res.Succeeded)
                {
                    return "Ok";
                }
                return "Couldn't delete user Imple";
            }
            else 
            {
                return "User not found";    
            }
            
        }

        //edit_employee
        public async Task<string> Edit_employee(EditUserModelAdmin userNewDets) 
        {
            var user =await userManager.FindByNameAsync(userNewDets.Eid.ToString());
            if (user != null)
            {
                if(userNewDets.Emp_Name != null)
                {
                    user.Emp_Name = userNewDets.Emp_Name;
                }
                if(userNewDets.DOJ != null)
                {
                    user.DOJ = (DateTime)userNewDets.DOJ;
                }
                if(userNewDets.WMail != null)
                {
                    user.WMail = userNewDets.WMail;
                }
                await userManager.UpdateAsync(user);
                if(userNewDets.role != null)
                {
                    var CurRole = await userManager.GetRolesAsync(user);
                    Console.WriteLine("roles",CurRole);
                    if (CurRole.Any())
                    {
                        string userRole = CurRole.First();
                        if (userRole != userNewDets.role)
                        {
                            var res1 = await userManager.RemoveFromRoleAsync(user, userRole);
                            if(res1.Succeeded)
                            {
                                Console.WriteLine("Role deleted");
                                var res2 = await userManager.AddToRoleAsync(user, userNewDets.role);
                                Console.WriteLine(userManager.GetRolesAsync(user));
                                if (res2.Succeeded)
                                {
                                    Console.WriteLine("Role added");
                                    return "Ok";
                                }
                                else
                                {
                                    return "New role not assigned";
                                }
                            }
                            else
                            {
                                return "old role not removed";
                            }  
                        }
                        else
                        {
                            return "role is same as previous";
                        }
                    }
                    else
                    {
                        return "user has no role";
                    }
                }
                else
                {
                    return "no new changes";
                }
            }
            else
            {
                return "user not found";
            }
        }

        //change_password
        public async Task<string> Edit_password(PwdChangeModel pwds, string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if(user != null)
            {
                var result =await userManager.ChangePasswordAsync(user, pwds.oldPassword, pwds.newPassword);
                if (result.Succeeded)
                {
                    return "Ok";
                }
                else
                {
                    return "error";
                }
            }
            else
            {
                return "User not Found";
            }
        }


        //edit_profile
        public async Task<string> Edit_profile(EditUserModelUser NewDets, string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user != null)
            {
                if (NewDets.Nick_Name != null)
                {
                    user.Nick_Name = NewDets.Nick_Name;
                }
                if (NewDets.DOB != null)
                {
                    user.DOB = (DateTime)NewDets.DOB;
                }
                if (NewDets.phonenumber != null)
                {
                    user.PhoneNumber = NewDets.phonenumber.ToString();
                }
                if (NewDets.PMail != null)
                {
                    user.PMail = NewDets.PMail;
                }
                if (NewDets.WhatsApp != null)
                {
                    user.WhatsApp = NewDets.WhatsApp;
                }
                if (NewDets.LinkedIn != null)
                {
                    user.LinkedIn = NewDets.LinkedIn;
                }
                await userManager.UpdateAsync(user);
                return "Ok";
            }
            else
            {
                return "User not Found";
            }
        }

        public List<User> GetAllUsers()
        {
            try
            {
                var result = _context.Users.ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<User> GetBirthdayMonth(int birthMonth)
        {

            try
            {
                return _context.Users
               .Where(emp => emp.DOB.Month == birthMonth)
               .ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

        }

        /* ----------------------------------------- News ---------------------- */

        public string AddNews(News news)
        {
            try
            {
                _context.News.Add(news);
                var result = _context.SaveChanges();
                if (result != 0)
                {
                    return "Ok";
                }
                else
                {
                    return "Fail";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public List<News>? GetAllNews()
        {
            try
            {
                var result = _context.News.ToList();
                Console.WriteLine("NewDescription" + result[0].Description);
                return result;
            }
            catch (Exception ex) 
            {
                Console.WriteLine(ex);
                return null;
            }
        }
        public List<News>? GetEidNews(string eid)
        {
            try
            {
                var EID = Int16.Parse(eid);
                User c = _context.Users.FirstOrDefault(_c => _c.Eid==EID);
                Console.WriteLine("result"+c);
                var result = _context.News.Where(a => a.E_Id == c.Id)
                    .OrderByDescending(a =>a.P_Date).ToList();
                Console.WriteLine(result);
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<News>? GetNewsDetails(string news_id)
        {
            try
            {
                var result = _context.News.Where(c => c.Id == news_id).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /* ----------------------------------------- Events ---------------------- */

        public string AddEvents(EventDTO eDTO, string id, string role)
        {
            try
            {
                
                var host_eid = _context.Users.FirstOrDefault(u => u.Id == id).Eid;
                var host_id = _context.Users.FirstOrDefault(u => u.Id == id).Id;
                var e_model = EventDTO.UpdateFromDto(eDTO);
                e_model.E_Id = id;
                e_model.Host = host_eid.ToString();
                e_model.Image = null;
                if(role == "Executive")
                {
                    e_model.Status = "Approved";
                }
                else
                {
                    e_model.Status = "Pending";
                }
                _context.Events.Add(e_model);
                var plist = eDTO.event_participants;
                EventDetail eventDetailHost = new EventDetail
                {
                    Eid = e_model.Id,
                    E_Uid = host_id,
                    Response = "Yes"
                };
                _context.EventDetails.Add(eventDetailHost);
                foreach (var empid in plist)
                {
                    Console.WriteLine(empid);
                    var EID = Int16.Parse(empid);
                    var UserId = _context.Users.FirstOrDefault(u => u.Eid == EID).Id;
                    EventDetail eventDetail = new EventDetail
                    {
                        Eid = e_model.Id,
                        E_Uid = UserId,
                        Response = "No"
                    };
                    _context.EventDetails.Add(eventDetail);
                }
                var rows = _context.SaveChanges();
                Console.WriteLine(rows);
                return "Ok";
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return "Fail";

            }
        }



        public List<Event>? GetEidEvents(string eid)
        {
            try
            {
                var EID = Int16.Parse(eid);
                var user = _context.Users.FirstOrDefault( u=> u.Eid == EID );
                var events = _context.EventDetails.Where(e=>e.E_Uid == user.Id).Select(e=>e.Eid).ToList();
                var le = _context.Events.Where(row => row.Status== "Approved" && events.Contains(row.Id))
                .Select(row => new Event
                {
                    Id = row.Id,
                    E_Id = row.E_Id,
                    Host = row.Host,
                    Title = row.Title,
                    Description = row.Description,
                    Start_Date = row.Start_Date,
                    End_Date = row.End_Date,
                    Status = row.Status,
                    Yes = row.Yes,
                    No = row.No,
                })
                .OrderByDescending(row => row.Start_Date).ToList();
                Console.WriteLine("imp event cnt",le.Count);
                return le;
            }
            catch(Exception ex)
            {
                Console.WriteLine("fel into catch");
                Console.WriteLine(ex);
                return null;
            }
        }

        public string UpdateAtendeStatus(string status, string id, string event_id)
        {
            try
            {
                var row = _context.EventDetails.FirstOrDefault(e=>e.E_Uid == id && e.Eid == event_id);
                row.Response = status;
                _context.SaveChanges();
                return "Ok";
            }
            catch
            {
                return "Fail";
            }
        }

        public string UpdateEventStatus(string status, string event_id)
        {
            try
            {
                 var events = _context.Events.FirstOrDefault(e=>e.Id == event_id);
                 if (events != null)
                 {
                    events.Status = status;
                    _context.SaveChanges();
                    return "Ok";
                 }
                 return "Fail";
            }
            catch
            {
                return "Fail";
            }
        }

        public List<Event>? Approvals(string status)
        {
            try
            {
                if(status == "Pending")
                {
                    var events  = _context.Events.Where(e => e.Status == "Pending").ToList();
                    return events;
                }
                else if(status == "Approved")
                {
                    var events = _context.Events.Where(e => e.Status == "Approved").ToList();
                    return events;
                }
                else if(status == "Rejected")
                {
                    var events = _context.Events.Where(e => e.Status == "Rejected").ToList();
                    return events;
                }
                else if (status == "All")
                {
                    var events = _context.Events.ToList();
                    return events;
                }
                else { return null; }
            }
            catch
            {
                return null;
            }
        }

        public List<User> GetParticipants(string event_id, string status)
        {
            try
            {
                var users_ids = _context.EventDetails.Where(e => e.Eid == event_id && e.Response == status).Select(row => row.E_Uid).ToList();
                var users = _context.Users.Where(row => users_ids.Contains(row.Id))
                .Select(row => new User
                {
                    Id = row.Id,
                    Emp_Name = row.Emp_Name,
                    Eid = row.Eid,
                })
                .ToList();
                return users;
            }
            catch
            {
                return null;
            }
        }

        public string ReactToNews(string news_id, bool reaction, string id)
        {
            try
            {
                //News n = _context.News.FirstOrDefault(n => n.Id == news_id);
                var row = _context.NewsActivity.FirstOrDefault(n => n.N_Id == news_id && n.E_Id == id);
                if(row  == null)
                {
                    NewsActivity na = new NewsActivity
                    {
                        N_Id = news_id,
                        E_Id = id,
                        //True for Like and False for dislike
                        Reaction = reaction,
                    };
                    _context.NewsActivity.Add(na);
                }
                else if (row.Reaction == reaction)
                {
                    _context.NewsActivity.Remove(row);
                }
                else if (row.Reaction != reaction)
                {
                    row.Reaction = reaction;
                }
                _context.SaveChanges();
                return "Ok";
            }
            catch (Exception)
            {
                
                return null;
                //throw;
            }
        }

        public ReactionList NewsReactionList(string news_id)
        {
            try
            {
                var listOfUsersIdLiked = _context.NewsActivity.Where(n => n.N_Id == news_id && n.Reaction == true).Select(row => row.E_Id).ToList();
                var listOfUsersIdDisLiked = _context.NewsActivity.Where(n => n.N_Id == news_id && n.Reaction == false).Select(row => row.E_Id).ToList();
                var listUserEidLiked = _context.Users.Where(u => listOfUsersIdLiked.Contains(u.Id)).Select(u => u.Eid).ToList();
                var listUserEidDisLiked = _context.Users.Where(u => listOfUsersIdDisLiked.Contains(u.Id)).Select(u => u.Eid).ToList();
                ReactionList rl = new ReactionList
                {
                    Liked = listUserEidLiked,
                    Disliked = listUserEidDisLiked,
                }; 
                return rl;

            }
            catch (Exception)
            {
                return null;
                //throw;
            }
        }
    }
}