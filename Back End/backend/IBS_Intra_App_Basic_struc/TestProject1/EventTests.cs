using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using IBS_Intra_App.DAL.Models;
using Xunit;

namespace IBS_Intra_App.Tests.Models
{
    public class EventTests
    {
        [Fact]
        [Trait("Category", "UnitTest")]
        public void CreateEventInstance_AllRequiredPropertiesFilled()
        {
            // Arrange
            string id = "1";
            string eId = "E001";
            string host = "John Doe";
            string title = "Test Event";
            DateTime startDate = DateTime.Now;
            DateTime? endDate = DateTime.Now.AddDays(1);
            string status = "Pending";
            User user = new User();

            // Act
            Event @event = new Event
            {
                Id = id,
                E_Id = eId,
                Host = host,
                Title = title,
                Start_Date = startDate,
                End_Date = endDate,
                Status = status,
                User = user
            };

            // Assert
            Xunit.Assert.Equal(id, @event.Id);
            Xunit.Assert.Equal(eId, @event.E_Id);
            Xunit.Assert.Equal(host, @event.Host);
            Xunit.Assert.Equal(title, @event.Title);
            Xunit.Assert.Equal(startDate, @event.Start_Date);
            Xunit.Assert.Equal(endDate, @event.End_Date);
            Xunit.Assert.Equal(status, @event.Status);
            Xunit.Assert.Equal(user, @event.User);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetId_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedId = "12345";

            // Act
            @event.Id = expectedId;

            // Assert
            Xunit.Assert.Equal(expectedId, @event.Id);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetEId_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedEId = "12345";

            // Act
            @event.E_Id = expectedEId;

            // Assert
            Xunit.Assert.Equal(expectedEId, @event.E_Id);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetHost_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedHost = "John Doe";

            // Act
            @event.Host = expectedHost;

            // Assert
            Xunit.Assert.Equal(expectedHost, @event.Host);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetTitle_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedTitle = "Valid Title";

            // Act
            @event.Title = expectedTitle;

            // Assert
            Xunit.Assert.Equal(expectedTitle, @event.Title);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetStartDate_ValidDateTimeValue()
        {
            // Arrange
            var @event = new Event();
            var expectedDate = new DateTime(2022, 1, 1);

            // Act
            @event.Start_Date = expectedDate;

            // Assert
            Xunit.Assert.Equal(expectedDate, @event.Start_Date);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetEndDate_ValidDateTimeValue()
        {
            // Arrange
            var @event = new Event();
            var expectedDate = new DateTime(2022, 1, 2);

            // Act
            @event.End_Date = expectedDate;

            // Assert
            Xunit.Assert.Equal(expectedDate, @event.End_Date);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetStatus_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedStatus = "Approved";

            // Act
            @event.Status = expectedStatus;

            // Assert
            Xunit.Assert.Equal(expectedStatus, @event.Status);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetYes_ValidIntValue()
        {
            // Arrange
            var @event = new Event();
            var expectedYes = 10;

            // Act
            @event.Yes = expectedYes;

            // Assert
            Xunit.Assert.Equal(expectedYes, @event.Yes);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetNo_ValidIntValue()
        {
            // Arrange
            var @event = new Event();
            var expectedNo = 5;

            // Act
            @event.No = expectedNo;

            // Assert
            Xunit.Assert.Equal(expectedNo, @event.No);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetImage_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedImage = "event.jpg";

            // Act
            @event.Image = expectedImage;

            // Assert
            Xunit.Assert.Equal(expectedImage, @event.Image);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetDescription_ValidStringValue()
        {
            // Arrange
            var @event = new Event();
            var expectedDescription = "This is a valid description.";

            // Act
            @event.Description = expectedDescription;

            // Assert
            Xunit.Assert.Equal(expectedDescription, @event.Description);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetUser_ValidUserObject()
        {
            // Arrange
            var @event = new Event();
            var user = new User();

            // Act
            @event.User = user;

            // Assert
            Xunit.Assert.Equal(user, @event.User);
        }
    }
}
