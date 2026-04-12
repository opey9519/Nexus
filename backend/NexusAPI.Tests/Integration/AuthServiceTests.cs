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
        // Arrange Data
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

    [Fact]
    public async Task Register_ReturnsFail_WhenInvalidPassword()
    {
        var newUser = new CreateUserDto
        {
            Email = "TestEmail@gmail.com",
            Username = "TestUser",
            Password = "1234$",
            FirstName = "TestFirst",
            LastName = "TestLast"
        };

        // Call Register User
        var response = await Client.PostAsJsonAsync("/api/auth/register", newUser);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenValidUser()
    {
        var newUser = new LoginUserDto
        {
            Email = "seeded@test.com",
            Password = "Password123!"
        };

        var response = await Client.PostAsJsonAsync("/api/auth/login", newUser);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsFail_WhenInvalidPassword()
    {
        var newUser = new LoginUserDto
        {
            Email = "seeded@test.com",
            Password = "Password123@"
        };

        var response = await Client.PostAsJsonAsync("/api/auth/login", newUser);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task RefreshToken_ReturnsNewTokens_WhenValidRefreshToken()
    {
        var newUser = new LoginUserDto
        {
            Email = "seeded@test.com",
            Password = "Password123!"
        };

        var loginResponse = await Client.PostAsJsonAsync("/api/auth/login", newUser);
        loginResponse.EnsureSuccessStatusCode();

        var cookies = loginResponse.Headers.GetValues("Set-Cookie").Select(c => c.Split(";")[0]).ToList();

        // Act 2: Refresh
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        request.Headers.Add("Cookie", string.Join("; ", cookies));

        var refreshResponse = await Client.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);
        Assert.True(refreshResponse.Headers.Contains("Set-Cookie"));
    }
}