//////without serilog

//using IBS_Intra_App.DAL.Context;
//using IBS_Intra_App.DAL.Models;
//using IBS_Intra_App.DAL.Implementation;
//using IBS_Intra_App.BLL.Service;
//using IBS_Intra_App.Interface;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using System.Text;
//using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
//using Microsoft.Extensions.FileProviders;
//using Serilog;

//var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();

//builder.Services.AddSwaggerGen(option =>
//    option.AddSecurityRequirement(new OpenApiSecurityRequirement
//     {
//         {
//               new OpenApiSecurityScheme
//                 {
//                     Reference = new OpenApiReference
//                     {
//                         Type = ReferenceType.SecurityScheme,
//                         Id = "Bearer"
//                     }
//                 },
//                 new string[] {}
//         }
//     }
//    ));
////adding cors
//builder.Services.AddCors(options =>
//    options.AddPolicy("Mypolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));


////idenityDbContext
//builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(
//    builder.Configuration.GetConnectionString("DefaultConnection")));

////identity
//builder.Services.AddIdentity<User, IdentityRole>()
//    .AddDefaultTokenProviders()
//    .AddEntityFrameworkStores<ApplicationDbContext>();

////authentication usign jwt, refresh token stuff also there
//builder.Services.AddAuthentication(x =>
//{
//    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(o =>
//{
//    var Key = Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]);
//    o.SaveToken = true;
//    o.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = false, // on production make it true
//        ValidateAudience = false, // on production make it true
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = builder.Configuration["JWT:Issuer"],
//        ValidAudience = builder.Configuration["JWT:Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Key),
//        ClockSkew = TimeSpan.Zero
//    };
//    o.Events = new JwtBearerEvents
//    {
//        OnAuthenticationFailed = context =>
//        {
//            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
//            {
//                context.Response.Headers.Add("IS-TOKEN-EXPIRED", "true");
//            }
//            return Task.CompletedTask;
//        }
//    };
//});


////dependency injection
//builder.Services.AddScoped<IAppService, AppService>();
//builder.Services.AddScoped<IAppImplementation, AppImplementation>();

//builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles")),
//    RequestPath = "/StaticFiles"
//});
//app.UseHttpsRedirection();
//app.UseCors("Mypolicy"); // For CROS issuse , to accept any client 
//app.UseAuthentication(); // This need to be added before UseAuthorization()	
//app.UseAuthorization();

//app.MapControllers();
//app.Run();




//using Serilog;
using IBS_Intra_App.DAL.Context;
using IBS_Intra_App.DAL.Models;
using IBS_Intra_App.DAL.Implementation;
using IBS_Intra_App.BLL.Service;
using IBS_Intra_App.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Microsoft.Extensions.FileProviders;
using Serilog;
using Serilog.Sinks.File;

try
{
    var builder = WebApplication.CreateBuilder(args);


    //Initialize logger    
    var logFilePath = "Logs/AppLogs.txt"; // Adjust the path as needed

    var logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Information)
    .WriteTo.Console()
    .WriteTo.File(
        path: logFilePath,
        rollingInterval: RollingInterval.Day, // Log rotation interval (e.g., daily)
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();
    builder.Logging.AddSerilog(logger);

    Log.Logger = logger;

    builder.Services.AddHttpContextAccessor();

    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    //swagger setup
    builder.Services.AddSwaggerGen(option =>
        option.AddSecurityRequirement(new OpenApiSecurityRequirement
         {
         {
               new OpenApiSecurityScheme
                 {
                     Reference = new OpenApiReference
                     {
                         Type = ReferenceType.SecurityScheme,
                         Id = "Bearer"
                     }
                 },
                 new string[] {}
         }
         }
        ));

    //adding cors
    builder.Services.AddCors(options =>
        options.AddPolicy("Mypolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));


    //idenityDbContext
    builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

    //identityUser Setup
    builder.Services.AddIdentity<User, IdentityRole>()
        .AddDefaultTokenProviders()
        .AddEntityFrameworkStores<ApplicationDbContext>();

    //authentication usign jwt, refresh token stuff also there
    builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(o =>
    {
        var Key = Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]);
        o.SaveToken = true;
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false, // on production make it true
            ValidateAudience = false, // on production make it true
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Key),
            ClockSkew = TimeSpan.Zero
        };
        o.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.Headers.Add("IS-TOKEN-EXPIRED", "true");
                }
                return Task.CompletedTask;
            }
        };
    });


    //dependency injection
    builder.Services.AddScoped<IAppService, AppService>();
    builder.Services.AddScoped<IAppImplementation, AppImplementation>();

    builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles")),
        RequestPath = "/StaticFiles"
    });



    app.UseHttpsRedirection();
    app.UseCors("Mypolicy"); // For CROS issuse , to accept any client 
    app.UseAuthentication(); // This need to be added before UseAuthorization()	
    app.UseAuthorization();

    app.MapControllers();


    Log.Information("Application Starting.");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "The Application failed to start.");
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush(); // Ensure that all log entries are written before the application exits

}


