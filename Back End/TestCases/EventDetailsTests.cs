using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using IBS_Intra_App.DAL.Models;
using Xunit;

namespace IBS_Intra_App.Tests.Models
{
    public class EventDetailTests
    {
        [Fact]
        [Trait("Category", "UnitTest")]
        public void CreateEventDetailInstance_AllRequiredPropertiesFilled()
        {
            // Arrange
            string uid = "1";
            string eUid = "E001";
            string eid = "E002";
            string response = "Yes";
            User user = new User();
            Event @event = new Event();

            // Act
            EventDetail eventDetail = new EventDetail
            {
                Uid = uid,
                E_Uid = eUid,
                Eid = eid,
                Response = response,
                User = user,
                Event = @event
            };

            // Assert
            Assert.Equal(uid, eventDetail.Uid);
            Assert.Equal(eUid, eventDetail.E_Uid);
            Assert.Equal(eid, eventDetail.Eid);
            Assert.Equal(response, eventDetail.Response);
            Assert.Equal(user, eventDetail.User);
            Assert.Equal(@event, eventDetail.Event);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetUid_ValidStringValue()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var expectedUid = "12345";

            // Act
            eventDetail.Uid = expectedUid;

            // Assert
            Assert.Equal(expectedUid, eventDetail.Uid);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetEUid_ValidStringValue()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var expectedEUid = "12345";

            // Act
            eventDetail.E_Uid = expectedEUid;

            // Assert
            Assert.Equal(expectedEUid, eventDetail.E_Uid);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetEid_ValidStringValue()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var expectedEid = "E001";

            // Act
            eventDetail.Eid = expectedEid;

            // Assert
            Assert.Equal(expectedEid, eventDetail.Eid);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetResponse_ValidStringValue()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var expectedResponse = "Maybe";

            // Act
            eventDetail.Response = expectedResponse;

            // Assert
            Assert.Equal(expectedResponse, eventDetail.Response);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetUser_ValidUserObject()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var user = new User();

            // Act
            eventDetail.User = user;

            // Assert
            Assert.Equal(user, eventDetail.User);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetEvent_ValidEventObject()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var @event = new Event();

            // Act
            eventDetail.Event = @event;

            // Assert
            Assert.Equal(@event, eventDetail.Event);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetUserAndEvent_ValidObjects()
        {
            // Arrange
            var eventDetail = new EventDetail();
            var user = new User();
            var @event = new Event();

            // Act
            eventDetail.User = user;
            eventDetail.Event = @event;

            // Assert
            Assert.Equal(user, eventDetail.User);
            Assert.Equal(@event, eventDetail.Event);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void SetUserAndEvent_NullObjects()
        {
            // Arrange
            var eventDetail = new EventDetail();

            // Act
            eventDetail.User = null;
            eventDetail.Event = null;

            // Assert
            Assert.Null(eventDetail.User);
            Assert.Null(eventDetail.Event);
        }
    }
}
