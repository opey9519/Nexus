using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using NexusAPI.Models;

namespace NexusAPI.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUserModel>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<FoodEntry> FoodEntry { get; set; }
    public DbSet<WaterEntry> WaterEntry { get; set; }
    public DbSet<BodyweightEntry> BodyweightEntry { get; set; }
    public DbSet<Lifts> Lifts { get; set; }
    public DbSet<UserProfile> UserProfile { get; set; }
}