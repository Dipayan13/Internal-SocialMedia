using IBS_Intra_App.BLL.DTO;
using IBS_Intra_App.DAL.Models;
using IBS_Intra_App.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace IBS_Intra_App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AppController : ControllerBase
    {
        public readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration configuration;
        private readonly IAppService _appSer;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public AppController(IWebHostEnvironment hostingEnvironment,IAppService appSer,SignInManager<User> signInManager, IConfiguration configuration, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this._appSer = appSer;
            this._hostingEnvironment = hostingEnvironment;
        }

        
        [HttpGet("downloadapk")]
        public async Task<IActionResult> GetHtmlPage()
        {
            // Getting the path to your HTML file
            var filePath = Path.Combine(_hostingEnvironment.ContentRootPath, "SocialAppDownloadPage.html");

            // Read the HTML content
            var htmlContent = System.IO.File.ReadAllText(filePath);

            // Return the HTML content
            return Content(htmlContent, "text/html");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm]RegisterRequestModel registerRequestModel)
        {
            if (ModelState.IsValid)
            {
                string filePath = null;
                if (registerRequestModel.Image != null && registerRequestModel.Image.Length > 0)
                {
                    // Generate a unique file name
                    var uniqueFileName = registerRequestModel.Eid.ToString() + "_" + registerRequestModel.Image.FileName;
                    Console.WriteLine(_hostingEnvironment.ContentRootPath);
                    // Define the file path where you want to store the uploaded file
                    var uploadsFolderPath = Path.Combine(_hostingEnvironment.ContentRootPath, "StaticFiles/ProfilePicImages"); // Change to your preferred storage path
                    if (!Directory.Exists(uploadsFolderPath))
                    {
                        Directory.CreateDirectory(uploadsFolderPath);
                    }
                    var filePathOnServer = Path.Combine(uploadsFolderPath, uniqueFileName);

                    using (var fileStream = new FileStream(filePathOnServer, FileMode.Create))
                    {
                        await registerRequestModel.Image.CopyToAsync(fileStream);
                    }

                    // Set the file path or URL in your user database
                    filePath = "StaticFiles/ProfilePicImages/" + uniqueFileName; // Assuming you store a relative path
                }
                var user = new User
                {
                    Eid = registerRequestModel.Eid,
                    Emp_Name = registerRequestModel.Emp_Name,
                    DOJ = registerRequestModel.DOJ,
                    DOB = registerRequestModel.DOB,
                    Nick_Name = registerRequestModel.Nick_Name,
                    WhatsApp = registerRequestModel.WhatsApp,
                    LinkedIn = registerRequestModel.LinkedIn,
                    PMail = registerRequestModel.PMail,
                    WMail = registerRequestModel.WhatsApp,
                    UserName = registerRequestModel.Eid.ToString(),
                    PhoneNumber = registerRequestModel.phoneNumber.ToString(),
                    Image = filePath,
                    Email =  registerRequestModel.Eid.ToString()
                };
                Console.WriteLine(user.UserName);
            
                var result = await userManager.CreateAsync(user, registerRequestModel.Password);
                Console.WriteLine(userManager.GetUserName);
                if (result.Succeeded)
                {
                    if (!await roleManager.RoleExistsAsync(registerRequestModel.role))
                        await roleManager.CreateAsync(new IdentityRole(registerRequestModel.role));

                    if (await roleManager.RoleExistsAsync(registerRequestModel.role))
                        await userManager.AddToRoleAsync(user, registerRequestModel.role);
                    Console.WriteLine($"User {user.UserName} logged in.");
                    return Ok(new { message = "Ok" });
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            return BadRequest(ModelState);
        }

        /* ----------------------------------------- Profile ---------------------- */


        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("profile")]
        //Get the requested profile
        public IActionResult GetProfile(string eid)
        {
            if (ModelState.IsValid)
            {
                // get self profile
                if (eid == "No")
                {
                    var Eid = User.FindFirstValue("Eid");
                    Console.WriteLine(Eid);
                    var result = _appSer.GetEidProfile(Eid);
                    if (result != null)
                    {
                        return Ok(new { emp_profile = result });
                    }
                    else
                    {
                        return Ok(new { message = "No employee found" });
                    }
                }
                // get specific employee new
                else
                {
                    var result = _appSer.GetEidProfile(eid);
                    if (result != null)
                    {
                        return Ok(new { emp_profile = result });
                    }
                    else
                    {
                        return Ok(new { message = "No employee found" });
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("birthday")]
        //Get requested birthdays
        public IActionResult GetBirthday(string month = "No")
        {
            if (ModelState.IsValid)
            {
                List<User> birthdayEmployees = _appSer.GetBirthdayMonth(month);
                if (birthdayEmployees.Count() > 0)
                {
                    return Ok(birthdayEmployees);
                }
                else
                {
                    return Ok(new { message = "No Birthdays this month" });
                }

            }

            return BadRequest(ModelState);

        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("get_employees")]
        //Get the details of all users
        public IActionResult GetEmployees()
        {
            var users = _appSer.GetAllUsers();

            if (users == null || !users.Any())
            {
                return NotFound();
            }

            return Ok(users);
        }


        //remove a user
        [Authorize(Roles = "Admin")]
        [HttpGet("remove_user")]
        public IActionResult Remove_User(string eid)
        {
            if (ModelState.IsValid)
            {
                var result = _appSer.Remove_user(eid);
                if (result.Result != null)
                {
                    return Ok(new { message = result.Result });
                }
                else
                {
                    return Ok(new { message = "error" });
                }
            }
            return BadRequest(ModelState);
        }


        //edit employee for admin
        [Authorize(Roles = "Admin")]
        [HttpPost("edit_employee")]
        public IActionResult Edit_Employee([FromBody]EditUserModelAdmin? userNewDets)
        {
            var result = _appSer.Edit_employee(userNewDets);
            return Ok(new { message = result.Result });
        }

        //edit_password for users
        [Authorize(Roles = "User,Executive,Admin")]
        [HttpPost("edit_password")]
        public IActionResult Edit_password([FromBody] PwdChangeModel pwds)
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = _appSer.Edit_password(pwds,id);
            return Ok(new { message = result.Result });
        }


        //edit nickName
        [Authorize(Roles = "User,Executive,Admin")]
        [HttpPost("edit_profile")]
        public IActionResult Edit_profile([FromBody] EditUserModelUser NewDets)
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = _appSer.Edit_profile(NewDets, id);
            return Ok(new { message = result.Result });
        }


        /* ------------------------------------ Dashboard ---------------------- */
        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("dashboard_view")]
        public IActionResult Dashboard_view(string nos)
        {
            if (ModelState.IsValid)
            {
                var id = User.FindFirstValue("Eid");
                var result = _appSer.DashboardView(nos, id);
                return Ok(new { list_of_latest = result });
            }
            return BadRequest(ModelState);

        }


        /* ----------------------------------------- News ---------------------- */

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpPost("add_news")]
        public IActionResult AddNews([FromForm] NewsDTO news)
        {
            // gets the claims stored in token
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // calls the service layer
            var result = _appSer.AddNews(news,id);
            return Ok(new { message = result });
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("get_news")]
        public IActionResult GetNews(string eid)
        {
            if (ModelState.IsValid)
            {
                // get all news 
                if (eid == "No")
                {
                    var result = _appSer.GetAllNews();
                    if (result != null)
                    {
                        return Ok(new { list_of_news = result });
                    }
                    else
                    {
                        return Ok(new { message = "error" });
                    }
                }
                // get specific employee new
                else
                {
                    var result = _appSer.GetEidNews(eid);
                    if (result != null)
                    {
                        return Ok(new { list_of_news = result });
                    }
                    else
                    {
                        return Ok(new { message = "error" });
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("news_details")]
        public IActionResult GetNewsDeatils(string news_id)
        {
            if (ModelState.IsValid)
            {
                var result = _appSer.GetNewsDetails(news_id);
                if (result != null)
                {
                    return Ok(new { news = result });
                }
                else
                {
                    return Ok(new { message = "error" });
                }

            }
            return BadRequest(ModelState);
        }



        /* ----------------------------------------- Events ---------------------- */

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpPost("add_event")]
        public IActionResult AddEvent([FromBody] EventDTO events)
        {
            if (ModelState.IsValid)
            {
                // gets the claims stored in token
                var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirstValue(ClaimTypes.Role);
                var result = _appSer.AddEvents(events, id, role);
                return Ok(new { message = result });

            }
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("get_events")]
        public IActionResult GetEvents(string eid)
        {
            if (ModelState.IsValid)
            {
                var EID = eid;
                // get all events
                if (eid == "No")
                {
                    EID = User.FindFirstValue("Eid");
                }
                var result = _appSer.GetEidEvents(EID);
                if (result != null)
                {
                    return Ok(new { list_of_events = result });
                }
                else
                {
                    return Ok(new { message = "error" });
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("update_status")]
        public IActionResult UpdateAtendeStatus(string status, string event_id)
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = _appSer.UpdateAtendeStatus(status, id,event_id);
            return Ok(new { message = result });
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("update_event_status")]
        public IActionResult UpdateEventStatus(string status, string event_id)
        {
            var result = _appSer.UpdateEventStatus(status, event_id);
            return Ok(new { message = result });
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("approvals")]
        public IActionResult Approvals(string status)
        {
            var result = _appSer.Approvals(status);
            if (result != null)
            {
                return Ok(new { message = result });
            }
            else
            {
                return Ok(new { message = "error" });
            }
        }

        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("get_participants")]
        public IActionResult GetParticipants(string event_id,string status)
        {
            var result = _appSer.GetParticipants(event_id,status);
            if (result != null)
            {
                return Ok(new { message = result });
            }
            else
            {
                return Ok(new { message = "error" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestModel loginRequestmodel)
        {
            if (!ModelState.IsValid)
            {
                //if Model is inValid
                Log.Error("Login ModelState is invalid");
                return BadRequest(ModelState);
            }

            //extracting the User 
            var user = await userManager.FindByNameAsync(loginRequestmodel.Username);
            Log.Information("User Found");
            if (user != null)
            {
                if (await userManager.CheckPasswordAsync(user, loginRequestmodel.Password))
                {
                    var res = await signInManager.PasswordSignInAsync(user, loginRequestmodel.Password, false, false);

                    if (res.Succeeded)
                    {
                        Console.WriteLine($"User {user.UserName} logged in.");
                        Log.Information("User {user.UserName} logged in.");
                        // Generate a JWT token
                        var token = GenerateJwtToken(user);

                        //extracting Role and Eid
                        var userRoleList = await userManager.GetRolesAsync(user);
                        var userRole = userRoleList.FirstOrDefault();
                        var userEid = user.Eid;


                        return Ok((new { token = token, role = userRole, eid = userEid }));
                    }
                    else
                    {
                        return Ok((new { message = "User not signed in" }));
                    }
                }
                else
                {
                    //Password is incorrect
                    return Ok(new { message = "Invalid password" });
                }
            }
            else
            {
                // UserName is not found
                return Ok(new { message = "Username not found" });
            }
        }


        /* ----------------------------------------- NewsActivity ---------------------- */
        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("react_to_news")]
        public IActionResult ReactToNews(string news_id, Boolean reaction)
        {
            // gets the claims stored in token
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = _appSer.React_to_news(news_id,reaction,id);
            if (result != null)
            {
                return Ok(new { message = result });
            }
            else
            {
                return Ok(new { message = "error" });
            }

        }


        [Authorize(Roles = "User,Executive,Admin")]
        [HttpGet("News_reaction_list")]
        public IActionResult NewsReactionList(string news_id)
        {
            var result = _appSer.NewsReactionList(news_id);
            if (result != null)
            {
                return Ok(new { message = result });
            }
            else
            {
                return Ok(new { message = "error" });
            }

        }

        [HttpGet("logout")]

        public async Task<IActionResult> Logout()
        {
            var result = signInManager.SignOutAsync();
            return Ok(result);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                // Add other claims, e.g., Name
        
                // Add Role claim
                new Claim(ClaimTypes.Role, userManager.GetRolesAsync(user).Result.FirstOrDefault()),

                // Add Eid claim (if Eid is a property of the User class)
                new Claim("Eid", user.Eid.ToString())
            };
            

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                configuration["JWT:Issuer"],
                configuration["JWT:Issuer"],
                claims,
                expires: DateTime.Now.AddDays(5), // Token expiration time
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}