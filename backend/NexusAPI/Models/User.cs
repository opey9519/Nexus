using Microsoft.AspNetCore.Identity;
namespace NexusAPI.Models;

// Contains generic database model for users
// Inherits from Identity User, see docs for inherited properties - https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.identityuser?view=aspnetcore-10.0

public class ApplicationUserModel : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}