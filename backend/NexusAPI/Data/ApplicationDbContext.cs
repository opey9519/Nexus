using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using NexusAPI.Models;

namespace NexusAPI.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUserModel>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<FoodEntries> FoodEntries { get; set; }
    public DbSet<WaterEntries> WaterEntries { get; set; }
    public DbSet<BodyweightEntries> BodyweightEntries { get; set; }
    public DbSet<Lifts> Lifts { get; set; }
}