// Contains generic database model for users

namespace NexusAPI.Models;

public class User
{
    public Guid Id { get; set; }
    required public string Email { get; set; }
    required public string Username { get; set; }
    required public string PasswordHash { get; set; }
}