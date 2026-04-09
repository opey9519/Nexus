//

namespace NexusAPI.Tests.Infrastructure;

public abstract class IntegrationTestBase(WebApplicationFactory factory) : IClassFixture<WebApplicationFactory>
{
    protected readonly HttpClient Client = factory.CreateClient();
}