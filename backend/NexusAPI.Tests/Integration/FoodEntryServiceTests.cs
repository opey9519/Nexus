using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using NexusAPI.DTOs;
using NexusAPI.Tests.Infrastructure;

namespace NexusAPI.Tests.Integration;

public class FoodEntryServiceTests(WebApplicationFactory factory) : IntegrationTestBase(factory)
{
    private const string Route = "/api/nutrition/food-entry";

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

    private static CreateFoodEntryDto CreateValidFoodEntryDto()
    {
        return new CreateFoodEntryDto
        {
            FoodName = "Chicken Breast",
            Calories = 320,
            Protein = 62f,
            Carbohydrates = 0f,
            Fats = 7f,
            EatenAt = new DateTime(2026, 8, 10, 12, 0, 0, DateTimeKind.Utc)
        };
    }

    private static async Task<FoodEntryDto?> ReadFoodEntryAsync(HttpResponseMessage response)
    {
        var body = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<FoodEntryDto>(body, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
    }

    [Fact]
    public async Task CreateFood_ReturnsCreated_WhenAuthenticated()
    {
        var token = await LoginAndGetAccessTokenAsync();
        var request = CreateRequest(HttpMethod.Post, Route, token, CreateValidFoodEntryDto());

        var response = await Client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var created = await ReadFoodEntryAsync(response);
        Assert.Equal("Chicken Breast", created!.FoodName);
        Assert.Equal(320, created.Calories);
    }

    [Fact]
    public async Task GetFood_ReturnsOk_AndContainsCreatedFoodEntry()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidFoodEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadFoodEntryAsync(createResponse);

        var getRequest = CreateRequest(HttpMethod.Get, Route, token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var body = await getResponse.Content.ReadAsStringAsync();
        var foods = JsonSerializer.Deserialize<List<FoodEntryDto>>(body, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(foods);
        Assert.Contains(foods!, f => f.Id == created!.Id && f.FoodName == "Chicken Breast");
    }

    [Fact]
    public async Task GetFood_ReturnsOk_WhenFoodExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidFoodEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadFoodEntryAsync(createResponse);

        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created!.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
    }

    [Fact]
    public async Task GetFood_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{Guid.NewGuid()}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task EditFood_ReturnsNoContent_WhenFoodExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidFoodEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadFoodEntryAsync(createResponse);

        var updateDto = new UpdateFoodEntryDto
        {
            Calories = 400
        };
        var editRequest = CreateRequest(HttpMethod.Put, $"{Route}/{created!.Id}", token, updateDto);
        var editResponse = await Client.SendAsync(editRequest);

        Assert.Equal(HttpStatusCode.NoContent, editResponse.StatusCode);

        // Verify the update was persisted
        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);
        var updated = await ReadFoodEntryAsync(getResponse);

        Assert.Equal(400, updated!.Calories);
    }

    [Fact]
    public async Task EditFood_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var updateDto = new UpdateFoodEntryDto
        {
            Calories = 400
        };
        var editRequest = CreateRequest(HttpMethod.Put, $"{Route}/{Guid.NewGuid()}", token, updateDto);
        var editResponse = await Client.SendAsync(editRequest);

        Assert.Equal(HttpStatusCode.NotFound, editResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteFood_ReturnsNoContent_WhenFoodExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidFoodEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadFoodEntryAsync(createResponse);

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"{Route}/{created!.Id}", token);
        var deleteResponse = await Client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Verify the food entry is gone
        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteFood_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"{Route}/{Guid.NewGuid()}", token);
        var deleteResponse = await Client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.NotFound, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task FoodEndpoints_ReturnUnauthorized_WhenNotAuthenticated()
    {
        var response = await Client.GetAsync(Route);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UserCannotAccessAnotherUsersFoodEntry()
    {
        // Register + login a second, independent user
        var newUser = new CreateUserDto
        {
            Email = "SecondFoodUser@Test.com",
            Username = "SecondFoodUser",
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

        // User 1 creates a food entry
        var firstToken = await LoginAndGetAccessTokenAsync();
        var createRequest = CreateRequest(HttpMethod.Post, Route, firstToken, CreateValidFoodEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadFoodEntryAsync(createResponse);

        // User 2 must not be able to read, edit, or delete User 1's food entry
        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created!.Id}", secondToken);
        Assert.Equal(HttpStatusCode.NotFound, (await Client.SendAsync(getRequest)).StatusCode);

        var editRequest = CreateRequest(HttpMethod.Put, $"{Route}/{created.Id}", secondToken, new UpdateFoodEntryDto { Calories = 999 });
        Assert.Equal(HttpStatusCode.NotFound, (await Client.SendAsync(editRequest)).StatusCode);

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"{Route}/{created.Id}", secondToken);
        Assert.Equal(HttpStatusCode.NotFound, (await Client.SendAsync(deleteRequest)).StatusCode);
    }
}