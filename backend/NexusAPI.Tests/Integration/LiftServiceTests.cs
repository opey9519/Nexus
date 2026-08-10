using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using NexusAPI.DTOs;
using NexusAPI.Tests.Infrastructure;

namespace NexusAPI.Tests.Integration;

public class LiftServiceTests(WebApplicationFactory factory) : IntegrationTestBase(factory)
{
    // Login as the seeded test user and return the access_token cookie value
    private async Task<string> LoginAndGetAccessTokenAsync()
    {
        var login = new LoginUserDto
        {
            Email = "seeded@test.com",
            Password = "Password123!"
        };

        var loginResponse = await Client.PostAsJsonAsync("/api/auth/login", login);
        loginResponse.EnsureSuccessStatusCode();

        return loginResponse.Headers.GetValues("Set-Cookie")
            .Select(c => c.Split(";")[0])
            .FirstOrDefault(c => c.StartsWith("access_token=", StringComparison.OrdinalIgnoreCase))
            ?.Split("=", 2, StringSplitOptions.None)[1]
            ?? throw new InvalidOperationException("access_token cookie missing from login response");
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string url, string token, object? body = null)
    {
        var request = new HttpRequestMessage(method, url);
        request.Headers.Add("Cookie", $"access_token={token}");

        if (body != null)
        {
            request.Content = JsonContent.Create(body);
        }

        return request;
    }

    private static CreateLiftDto CreateValidLiftDto()
    {
        return new CreateLiftDto
        {
            ExerciseName = "Bench Press",
            WeightLBS = 225f,
            Reps = 5,
            Sets = 3,
            RPE = 8.5f,
            PerformedAt = new DateTime(2026, 8, 10, 15, 0, 0, DateTimeKind.Utc),
            Notes = "PR set"
        };
    }

    private static async Task<LiftEntryDto?> ReadLiftEntryAsync(HttpResponseMessage response)
    {
        var body = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<LiftEntryDto>(body, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
    }

    [Fact]
    public async Task CreateLift_ReturnsCreated_WhenAuthenticated()
    {
        var token = await LoginAndGetAccessTokenAsync();
        var request = CreateRequest(HttpMethod.Post, "/api/lifts", token, CreateValidLiftDto());

        var response = await Client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task GetLifts_ReturnsOk_AndContainsCreatedLift()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, "/api/lifts", token, CreateValidLiftDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadLiftEntryAsync(createResponse);

        var getRequest = CreateRequest(HttpMethod.Get, "/api/lifts", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var body = await getResponse.Content.ReadAsStringAsync();
        var lifts = JsonSerializer.Deserialize<List<LiftEntryDto>>(body, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(lifts);
        Assert.Contains(lifts!, l => l.Id == created!.Id && l.ExerciseName == "Bench Press");
    }

    [Fact]
    public async Task GetLift_ReturnsOk_WhenLiftExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, "/api/lifts", token, CreateValidLiftDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadLiftEntryAsync(createResponse);

        var getRequest = CreateRequest(HttpMethod.Get, $"/api/lifts/{created!.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
    }

    [Fact]
    public async Task GetLift_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var getRequest = CreateRequest(HttpMethod.Get, $"/api/lifts/{Guid.NewGuid()}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task EditLift_ReturnsNoContent_WhenLiftExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, "/api/lifts", token, CreateValidLiftDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadLiftEntryAsync(createResponse);

        var updateDto = new UpdateLiftEntryDto
        {
            WeightLBS = 245f
        };
        var editRequest = CreateRequest(HttpMethod.Put, $"/api/lifts/{created!.Id}", token, updateDto);
        var editResponse = await Client.SendAsync(editRequest);

        Assert.Equal(HttpStatusCode.NoContent, editResponse.StatusCode);

        // Verify the update was persisted
        var getRequest = CreateRequest(HttpMethod.Get, $"/api/lifts/{created.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);
        var updated = await ReadLiftEntryAsync(getResponse);

        Assert.Equal(245f, updated!.WeightLBS);
    }

    [Fact]
    public async Task EditLift_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var updateDto = new UpdateLiftEntryDto
        {
            WeightLBS = 245f
        };
        var editRequest = CreateRequest(HttpMethod.Put, $"/api/lifts/{Guid.NewGuid()}", token, updateDto);
        var editResponse = await Client.SendAsync(editRequest);

        Assert.Equal(HttpStatusCode.NotFound, editResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteLift_ReturnsNoContent_WhenLiftExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, "/api/lifts", token, CreateValidLiftDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadLiftEntryAsync(createResponse);

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"/api/lifts/{created!.Id}", token);
        var deleteResponse = await Client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Verify the lift is gone
        var getRequest = CreateRequest(HttpMethod.Get, $"/api/lifts/{created.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteLift_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"/api/lifts/{Guid.NewGuid()}", token);
        var deleteResponse = await Client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.NotFound, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task LiftEndpoints_ReturnUnauthorized_WhenNotAuthenticated()
    {
        var getResponse = await Client.GetAsync("/api/lifts");

        Assert.Equal(HttpStatusCode.Unauthorized, getResponse.StatusCode);
    }

    [Fact]
    public async Task UserCannotAccessAnotherUsersLift()
    {
        // Register + login a second, independent user
        var newUser = new CreateUserDto
        {
            Email = "SecondUser@Test.com",
            Username = "SecondUser",
            Password = "TestPassword123$",
            FirstName = "Second",
            LastName = "User"
        };

        var registerResponse = await Client.PostAsJsonAsync("/api/auth/register", newUser);
        registerResponse.EnsureSuccessStatusCode();

        var secondLogin = new LoginUserDto
        {
            Email = newUser.Email,
            Password = newUser.Password
        };
        var secondLoginResponse = await Client.PostAsJsonAsync("/api/auth/login", secondLogin);
        secondLoginResponse.EnsureSuccessStatusCode();

        var secondToken = secondLoginResponse.Headers.GetValues("Set-Cookie")
            .Select(c => c.Split(";")[0])
            .FirstOrDefault(c => c.StartsWith("access_token=", StringComparison.OrdinalIgnoreCase))
            ?.Split("=", 2, StringSplitOptions.None)[1]
            ?? throw new InvalidOperationException("access_token cookie missing from login response");

        // User 1 creates a lift
        var firstToken = await LoginAndGetAccessTokenAsync();
        var createRequest = CreateRequest(HttpMethod.Post, "/api/lifts", firstToken, CreateValidLiftDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadLiftEntryAsync(createResponse);

        // User 2 must not be able to read, edit, or delete User 1's lift
        var getRequest = CreateRequest(HttpMethod.Get, $"/api/lifts/{created!.Id}", secondToken);
        Assert.Equal(HttpStatusCode.NotFound, (await Client.SendAsync(getRequest)).StatusCode);

        var editRequest = CreateRequest(HttpMethod.Put, $"/api/lifts/{created.Id}", secondToken, new UpdateLiftEntryDto { WeightLBS = 999f });
        Assert.Equal(HttpStatusCode.NotFound, (await Client.SendAsync(editRequest)).StatusCode);

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"/api/lifts/{created.Id}", secondToken);
        Assert.Equal(HttpStatusCode.NotFound, (await Client.SendAsync(deleteRequest)).StatusCode);
    }
}