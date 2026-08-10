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
    public DbSet<LiftEntry> Lifts { get; set; }
    public DbSet<UserProfile> UserProfile { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User <-> UserProfile (1:1)
        modelBuilder.Entity<UserProfile>()
            .HasOne(p => p.User)
            .WithOne(u => u.UserProfile)
            .HasForeignKey<UserProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserProfile>()
            .HasIndex(p => p.UserId)
            .IsUnique();

        // Entry tables: FoodEntry, WaterEntry, BodyweightEntry, LiftEntry
        // Each belongs directly to a single User.
        modelBuilder.Entity<FoodEntry>()
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WaterEntry>()
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BodyweightEntry>()
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LiftEntry>()
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}