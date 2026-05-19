using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
namespace NexusAPI.Models;

// Contains generic database model for users
// Inherits from Identity User, see docs for inherited properties - https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.identityuser?view=aspnetcore-10.0

public class ApplicationUserModel : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public UserProfile? UserProfile { get; set; }
}

public class UserProfile
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserId { get; set; }
    public float Height { get; set; }
    public float BodyWeightLBS { get; set; }
    public string? ActivityLevel { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<WaterEntries> WaterEntries { get; set; } = new List<WaterEntries>();
    public ICollection<FoodEntries> FoodEntries { get; set; } = new List<FoodEntries>();
    public ICollection<BodyweightEntries> BodyweightEntries { get; set; } = new List<BodyweightEntries>();
}