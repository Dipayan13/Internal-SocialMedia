using System;
using System.ComponentModel.DataAnnotations;
using IBS_Intra_App.DAL.Models;
using Microsoft.AspNetCore.Identity;
using Xunit; // Added using directive for the User class
namespace IBS_Intra_App.Tests.Models{
public class NewsTests
{
    [Fact]
    [Trait("Category", "UnitTest")]
    public void CreateNewsInstance_AllRequiredPropertiesFilled()
    {
        // Arrange
        string id = "1";
        string eId = "E001";
        string title = "Test News";
        DateTime pDate = DateTime.Now;
        User user = new User();

        // Act
        News news = new News
        {
            Id = id,
            E_Id = eId,
            Title = title,
            P_Date = pDate,
            User = user
        };

        // Assert
        Xunit.Assert.Equal(id, news.Id);
        Xunit.Assert.Equal(eId, news.E_Id);
        Xunit.Assert.Equal(title, news.Title);
        Xunit.Assert.Equal(pDate, news.P_Date);
        Xunit.Assert.Equal(user, news.User);
    }

    [Fact]
    [Trait("Category", "UnitTest")]
    public void SetId_ValidStringValue()
    {
        // Arrange
        var news = new News();
        var expectedId = "12345";

        // Act
        news.Id = expectedId;

        // Assert
        Xunit.Assert.Equal(expectedId, news.Id);
    }

    [Fact]
    [Trait("Category", "UnitTest")]
    public void SetEId_ValidStringValue()
    {
        // Arrange
        var news = new News();
        var expectedEId = "12345";

        // Act
        news.E_Id = expectedEId;

        // Assert
        Xunit.Assert.Equal(expectedEId, news.E_Id);
    }

    [Fact]
    [Trait("Category", "UnitTest")]
    public void SetTitle_ValidString()
    {
        // Arrange
        var news = new News();
        var expectedTitle = "Valid Title";

        // Act
        news.Title = expectedTitle;

        // Assert
        Xunit.Assert.Equal(expectedTitle, news.Title);
    }

    [Fact]
    [Trait("Category", "UnitTest")]
    public void SetPDate_ValidDateTimeValue()
    {
        // Arrange
        var news = new News();
        var expectedDate = new DateTime(2022, 1, 1);

        // Act
        news.P_Date = expectedDate;

        // Assert
        Xunit.Assert.Equal(expectedDate, news.P_Date);
    }

    [Fact]
    [Trait("Category", "UnitTest")]
    public void SetUserProperty_ValidUserObject()
    {
        // Arrange
        var news = new News();
        var user = new User();

        // Act
        news.User = user;

        // Assert
        Xunit.Assert.Equal(user, news.User);
    }
}}
