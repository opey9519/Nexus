using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using NexusAPI.DTOs;
using NexusAPI.Tests.Infrastructure;

namespace NexusAPI.Tests.Integration;

public class WaterEntryServiceTests(WebApplicationFactory factory) : IntegrationTestBase(factory)
{
    private const string Route = "/api/nutrition/water-entry";

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

    private static CreateWaterEntryDto CreateValidWaterEntryDto()
    {
        return new CreateWaterEntryDto
        {
            AmountML = 500,
            DrankAt = new DateTime(2026, 8, 10, 10, 0, 0, DateTimeKind.Utc)
        };
    }

    private static async Task<WaterEntryDto?> ReadWaterEntryAsync(HttpResponseMessage response)
    {
        var body = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<WaterEntryDto>(body, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
    }

    [Fact]
    public async Task CreateWater_ReturnsCreated_WhenAuthenticated()
    {
        var token = await LoginAndGetAccessTokenAsync();
        var request = CreateRequest(HttpMethod.Post, Route, token, CreateValidWaterEntryDto());

        var response = await Client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var created = await ReadWaterEntryAsync(response);
        Assert.Equal(500, created!.AmountML);
    }

    [Fact]
    public async Task GetWater_ReturnsOk_WhenWaterEntryExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidWaterEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadWaterEntryAsync(createResponse);

        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created!.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var got = await ReadWaterEntryAsync(getResponse);
        Assert.Equal(500, got!.AmountML);
    }

    [Fact]
    public async Task GetWater_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{Guid.NewGuid()}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task EditWater_ReturnsNoContent_WhenWaterEntryExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidWaterEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadWaterEntryAsync(createResponse);

        var updateDto = new UpdateWaterEntryDto
        {
            AmountML = 750
        };
        var editRequest = CreateRequest(HttpMethod.Put, $"{Route}/{created!.Id}", token, updateDto);
        var editResponse = await Client.SendAsync(editRequest);

        Assert.Equal(HttpStatusCode.NoContent, editResponse.StatusCode);

        // Verify the update was persisted
        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);
        var updated = await ReadWaterEntryAsync(getResponse);

        Assert.Equal(750, updated!.AmountML);
    }

    [Fact]
    public async Task EditWater_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var updateDto = new UpdateWaterEntryDto
        {
            AmountML = 750
        };
        var editRequest = CreateRequest(HttpMethod.Put, $"{Route}/{Guid.NewGuid()}", token, updateDto);
        var editResponse = await Client.SendAsync(editRequest);

        Assert.Equal(HttpStatusCode.NotFound, editResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteWater_ReturnsNoContent_WhenWaterEntryExists()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var createRequest = CreateRequest(HttpMethod.Post, Route, token, CreateValidWaterEntryDto());
        var createResponse = await Client.SendAsync(createRequest);
        createResponse.EnsureSuccessStatusCode();
        var created = await ReadWaterEntryAsync(createResponse);

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"{Route}/{created!.Id}", token);
        var deleteResponse = await Client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Verify the water entry is gone
        var getRequest = CreateRequest(HttpMethod.Get, $"{Route}/{created.Id}", token);
        var getResponse = await Client.SendAsync(getRequest);

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteWater_ReturnsNotFound_WhenMissing()
    {
        var token = await LoginAndGetAccessTokenAsync();

        var deleteRequest = CreateRequest(HttpMethod.Delete, $"{Route}/{Guid.NewGuid()}", token);
        var deleteResponse = await Client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.NotFound, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task WaterEndpoints_ReturnUnauthorized_WhenNotAuthenticated()
    {
        var response = await Client.GetAsync($"{Route}/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}