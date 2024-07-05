using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using IBS_Intra_App.BLL.DTO;
using IBS_Intra_App.Controllers;
using IBS_Intra_App.DAL.Models;
using IBS_Intra_App.Interface;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Moq;
using Xunit;

namespace IBS_Intra_App.Tests
{
    public class AppControllerTests
    {
        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task Register_ValidModel_ReturnsOk()
        {
            // Arrange
            var appServiceMock = new Mock<IAppService>();
            var signInManagerMock = MockSignInManager();
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();
            var configurationMock = new Mock<IConfiguration>();
            var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

            var controller = new AppController(
                hostingEnvironmentMock.Object,
                appServiceMock.Object,
                signInManagerMock.Object,
                configurationMock.Object,
                userManagerMock.Object,
                roleManagerMock.Object
            );

            var registerRequestModel = new RegisterRequestModel
            {
                // Set properties for a valid model
            };

            // Act
            var result = await controller.Register(registerRequestModel);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task Register_InvalidModel_ReturnsBadRequest()

        {
            // Arrange
            var appServiceMock = new Mock<IAppService>();
            var signInManagerMock = MockSignInManager();
            var userManagerMock = MockUserManager();
            var roleManagerMock = MockRoleManager();
            var configurationMock = new Mock<IConfiguration>();
           var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

            var controller = new AppController(
                hostingEnvironmentMock.Object,
                appServiceMock.Object,
                signInManagerMock.Object,
                configurationMock.Object,
                userManagerMock.Object,
                roleManagerMock.Object
            );

            var registerRequestModel = new RegisterRequestModel
            {
                // Set properties for an invalid model (missing required fields, etc.)
            };

            // Act
            var result = await controller.Register(registerRequestModel);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        
        // Add more test cases for other methods in the AppController class...
[Fact]
[Trait("Category", "UnitTest")]
public void GetProfile_ReturnsProfile()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Mock claims
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "123"),
        new Claim(ClaimTypes.Role, "User"),
        new Claim("Eid", "123"),
    };

    var identity = new ClaimsIdentity(claims, "TestAuthType");
    var claimsPrincipal = new ClaimsPrincipal(identity);

    controller.ControllerContext = new ControllerContext
    {
        HttpContext = new DefaultHttpContext { User = claimsPrincipal }
    };

    // Act
    var result = controller.GetProfile("No");

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of GetProfile
}
        
  [Fact]
[Trait("Category", "UnitTest")]
public void GetEmployees_ReturnsUsers()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.GetEmployees();

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of GetEmployees
}

// Test case for Remove_User
[Fact]
[Trait("Category", "UnitTest")]
public void Remove_User_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.Remove_User("123");

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of Remove_User
}

// Test case for Edit_Employee
[Fact]
[Trait("Category", "UnitTest")]
public void Edit_Employee_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.Edit_Employee(new EditUserModelAdmin());

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of Edit_Employee
}

       

// Test case for Edit_password
[Fact]
[Trait("Category", "UnitTest")]
public void Edit_password_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.Edit_password(new PwdChangeModel());

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of Edit_password
}

// Test case for Edit_profile
[Fact]
[Trait("Category", "UnitTest")]
public void Edit_profile_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.Edit_profile(new EditUserModelUser());

    // Assert
    Assert.IsType<OkObjectResult>(result);
    
    // Add more assertions based on the expected behavior of Edit_profile
}

// Test case for Dashboard_view
[Fact]
[Trait("Category", "UnitTest")]
public void Dashboard_view_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.Dashboard_view("123");

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of Dashboard_view
}

// Test case for AddNews
[Fact]
[Trait("Category", "UnitTest")]
public void AddNews_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Act
    var result = controller.AddNews(new NewsDTO());

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of AddNews
}

// ... Add more test cases for other methods in the AppController class ...
    

[Fact]
[Trait("Category", "UnitTest")]
public void GetNews_ReturnsResult()
{
    // Arrange
    var appServiceMock = new Mock<IAppService>();
    var signInManagerMock = MockSignInManager();
    var userManagerMock = MockUserManager();
    var roleManagerMock = MockRoleManager();
    var configurationMock = new Mock<IConfiguration>();
    var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

    var controller = new AppController(
        hostingEnvironmentMock.Object,
        appServiceMock.Object,
        signInManagerMock.Object,
        configurationMock.Object,
        userManagerMock.Object,
        roleManagerMock.Object
    );

    // Mock claims
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "123"),
        new Claim(ClaimTypes.Role, "User"),
        new Claim("Eid", "123"),
    };

    var identity = new ClaimsIdentity(claims, "TestAuthType");
    var claimsPrincipal = new ClaimsPrincipal(identity);

    controller.ControllerContext = new ControllerContext
    {
        HttpContext = new DefaultHttpContext { User = claimsPrincipal }
    };

    // Act
    var result = controller.GetNews("No");

    // Assert
    Assert.IsType<OkObjectResult>(result);
    // Add more assertions based on the expected behavior of GetNews
}       
        #region Mocks

private Mock<SignInManager<User>> MockSignInManager()
{
    var userStoreMock = new Mock<IUserStore<User>>();
    var userManagerMock = MockUserManager().Object;
    var contextAccessorMock = new Mock<IHttpContextAccessor>();
    var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();

    // Provide actual instances for IHttpContextAccessor and IUserStore<User>
    var signInManagerMock = new Mock<SignInManager<User>>(
        userManagerMock,
        contextAccessorMock.Object,
        claimsFactoryMock.Object,
        null,  // IOptions<IdentityOptions> can be null for testing
        null,  // ILogger<SignInManager<User>> can be null for testing
        userStoreMock.Object,  // Provide actual instance for IUserStore<User>
        null   // IAuthenticationSchemeProvider can be null for testing
    );

    // Setup any additional configurations or methods as needed

    return signInManagerMock;
}

private Mock<UserManager<User>> MockUserManager()
{
    // Implement a mock for UserManager<User> as needed
    // Example:
    var storeMock = new Mock<IUserStore<User>>();
    var userManagerMock = new Mock<UserManager<User>>(
        storeMock.Object,
        null, null, null, null, null, null, null, null
    );
    userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                   .ReturnsAsync(IdentityResult.Success);
    userManagerMock.Setup(x => x.FindByNameAsync(It.IsAny<string>()))
                   .ReturnsAsync((User)null);
    // Add more setups as needed

    // Setup UserManager methods used by SignInManager
    userManagerMock.Setup(x => x.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<string>()))
                   .ReturnsAsync(true);

    return userManagerMock;
}

private Mock<RoleManager<IdentityRole>> MockRoleManager()
{
    // Implement a mock for RoleManager<IdentityRole> as needed
    // Example:
    var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
    var roleManagerMock = new Mock<RoleManager<IdentityRole>>(
        roleStoreMock.Object,
        new List<IRoleValidator<IdentityRole>>(),
        null, null, null
    );
    // Setup RoleManager methods as needed

    return roleManagerMock;
}

        #endregion
    }
}
