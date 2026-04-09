using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NexusAPI.Data;
using Microsoft.Data.Sqlite;

// Creates Test Server inheriting from Program.cs
// Overrides and Modifies Configuration & Secrets from Program.cs

namespace NexusAPI.Tests.Infrastructure;

public class WebApplicationFactory : WebApplicationFactory<Program>
{
    private SqliteConnection _connection = default!;

    // Overrides existing configuration of Program.cs for Testing
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Configure Secrets to Test Server
        builder.ConfigureAppConfiguration((context, config) =>
        {
            var settings = new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "THIS_IS_A_TEST_SECRET_KEY_THAT_IS_AT_LEAST_32_BYTES_LONG",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience"
            };

            config.AddInMemoryCollection(settings);
        });

        // Configure Services (Database)
        builder.ConfigureServices(services =>
        {
            // Remove Existing DbContest
            // Do not want to affect Dev/Prod Databases during Tests
            var descriptors = services
                .Where(d => d.ServiceType.Namespace?.Contains("EntityFrameworkCore") == true)
                .ToList();

            foreach (var d in descriptors)
            {
                services.Remove(d);
            }

            // Add In-memory Test DB
            _connection = new SqliteConnection("Filename=:memory:");
            _connection.Open();

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlite(_connection);
            });

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            db.Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing)
        {
            _connection?.Close();
            _connection?.Dispose();
        }
    }
}