using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using NexusAPI.Data;
using NexusAPI.Models;

namespace NexusAPI.Tests.Infrastructure;

public static class TestDataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUserModel>>();
        var db = services.GetRequiredService<ApplicationDbContext>();

        // Avoid duplicate seeding
        if (db.Users.Any())
            return;

        var user = new ApplicationUserModel
        {
            Email = "seeded@test.com",
            UserName = "seededUser",
            FirstName = "Seeded",
            LastName = "User",
            CreatedAt = DateTime.UtcNow
        };

        await userManager.CreateAsync(user, "Password123!");
    }
}