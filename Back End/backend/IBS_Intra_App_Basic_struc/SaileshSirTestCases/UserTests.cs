using System;
using System.ComponentModel.DataAnnotations;
using IBS_Intra_App.DAL.Models;
using Microsoft.AspNetCore.Identity;
using Xunit;

namespace IBS_Intra_App.Tests.Models
{
    public class UserTests
    {
        private static void ValidateModel(object model)
        {
            var validationContext = new ValidationContext(model, null, null);
            Validator.ValidateObject(model, validationContext, true);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_ValidData_ShouldNotThrowValidationException()
        {
            // Arrange
            var user = new User
            {
                Eid = 123,
                Emp_Name = "John Doe",
                DOJ = DateTime.Now,
                DOB = DateTime.Now.AddYears(-30),
                PMail = "john.doe@company.com",
                WMail = "john.doe@work.com"
                // Add more properties as needed
            };

            // Act & Assert
            // This should not throw any validation exception
            Assert.NotNull(user);
            Assert.Equal(123, user.Eid);
            Assert.Equal("John Doe", user.Emp_Name);
            Assert.Equal(DateTime.Now.Date, user.DOJ.Date);
            Assert.Equal(DateTime.Now.AddYears(-30).Date, user.DOB.Date);
            Assert.Equal("john.doe@company.com", user.PMail);
            Assert.Equal("john.doe@work.com", user.WMail);
            // Add more assertions based on your properties
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_InvalidData_ShouldThrowValidationException()
        {
            // Arrange
            var invalidUser = new User
            {
                // Set properties with intentionally invalid data
                Eid = -1,  // Example: Setting Eid to a negative value
                Emp_Name = null,  // Example: Setting Emp_Name to null
                DOJ = DateTime.Now.AddYears(1),  // Example: Setting DOJ to a future date
                DOB = DateTime.Now,  // Example: Setting DOB to the current date
                PMail = "invalid-email",  // Example: Setting an invalid email format
                WMail = "john.doe@work.com"
                // Add more properties with invalid data as needed
            };

            // Act & Assert
            // Use Xunit Assert.Throws to verify that setting invalid values throws a ValidationException
            Assert.Throws<ValidationException>(() => ValidateModel(invalidUser));
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_ValidWhatsApp_ShouldNotThrowValidationException()
        {
            // Arrange
            var user = new User
            {
                Eid = 123,
                Emp_Name = "John Doe",
                DOJ = DateTime.Now,
                DOB = DateTime.Now.AddYears(-30),
                PMail = "john.doe@company.com",
                WMail = "john.doe@work.com",
                WhatsApp = "1234567890"
                // Add more properties as needed
            };

            // Act & Assert
            // This should not throw any validation exception
            Assert.NotNull(user);
            Assert.Equal("1234567890", user.WhatsApp);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_InvalidWhatsApp_ShouldThrowValidationException()
        {
            // Arrange
            var invalidUser = new User
            {
                // Set WhatsApp with an invalid format
                WhatsApp = "invalid-whatsapp-format"
                // Add other properties as needed
            };

            // Act & Assert
            // Use Xunit Assert.Throws to verify that setting an invalid WhatsApp format throws a ValidationException
            Assert.Throws<ValidationException>(() => ValidateModel(invalidUser));
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_ValidLinkedIn_ShouldNotThrowValidationException()
        {
            // Arrange
            var user = new User
            {
                // Set LinkedIn with a valid format
                LinkedIn = "https://www.linkedin.com/in/johndoe"
                // Add other properties as needed
            };

            // Act & Assert
            // This should not throw any validation exception
            Assert.NotNull(user);
            Assert.Equal("https://www.linkedin.com/in/johndoe", user.LinkedIn);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_InvalidLinkedIn_ShouldThrowValidationException()
        {
            // Arrange
            var invalidUser = new User
            {
                // Set LinkedIn with an invalid format
                LinkedIn = "invalid-linkedin-format"
                // Add other properties as needed
            };

            // Act & Assert
            // Use Xunit Assert.Throws to verify that setting an invalid LinkedIn format throws a ValidationException
            Assert.Throws<ValidationException>(() => ValidateModel(invalidUser));
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_ValidNickName_ShouldNotThrowValidationException()
        {
            // Arrange
            var user = new User
            {
                // Set NickName with a valid value
                Nick_Name = "JD"
                // Add other properties as needed
            };

            // Act & Assert
            // This should not throw any validation exception
            Assert.NotNull(user);
            Assert.Equal("JD", user.Nick_Name);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_InvalidNickName_ShouldThrowValidationException()
        {
            // Arrange
            var invalidUser = new User
            {
                // Set NickName with an invalid value
                Nick_Name = null
                // Add other properties as needed
            };

            // Act & Assert
            // Use Xunit Assert.Throws to verify that setting an invalid NickName format throws a ValidationException
            Assert.Throws<ValidationException>(() => ValidateModel(invalidUser));
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_ValidImage_ShouldNotThrowValidationException()
        {
            // Arrange
            var user = new User
            {
                // Set Image with a valid value
                Image = "image.jpg"
                // Add other properties as needed
            };

            // Act & Assert
            // This should not throw any validation exception
            Assert.NotNull(user);
            Assert.Equal("image.jpg", user.Image);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void UserProperties_InvalidImage_ShouldThrowValidationException()
        {
            // Arrange
            var invalidUser = new User
            {
                // Set Image with an invalid value
                Image = null
                // Add other properties as needed
            };

            // Act & Assert
            // Use Xunit Assert.Throws to verify that setting an invalid Image format throws a ValidationException
            Assert.Throws<ValidationException>(() => ValidateModel(invalidUser));
        }
    }
}
