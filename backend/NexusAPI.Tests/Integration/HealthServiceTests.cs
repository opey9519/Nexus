using System.Net;
using NexusAPI.Tests.Infrastructure;

namespace NexusAPI.Tests.Integration;

public class HealthServiceTests(WebApplicationFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task Get_ReturnsOk_WhenApiRunning()
    {
        var response = await Client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("API is running", body);
    }
}