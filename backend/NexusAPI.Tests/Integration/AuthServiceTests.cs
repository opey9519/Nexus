using System.Net;
using System.Net.Http.Json;
using NexusAPI.DTOs;
using NexusAPI.Tests.Infrastructure;

namespace NexusAPI.Tests.Integration;

public class AuthServiceTests(WebApplicationFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task Register_ReturnsCreated_WhenValidUser()
    {
        // Arrange, Act, Assert
        var newUser = new CreateUserDto
        {
            Email = "TestEmail@gmail.com",
            Username = "TestUser",
            Password = "TestPassword123$",
            FirstName = "TestFirst",
            LastName = "TestLast"
        };

        // Call Register User
        var response = await Client.PostAsJsonAsync("/api/auth/register", newUser);

        // var content = await response.Content.ReadAsStringAsync();
        // Console.WriteLine(content);

        // Assert Status code
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
}