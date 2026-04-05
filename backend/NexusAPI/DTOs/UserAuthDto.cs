namespace NexusAPI.DTOs;

// Input DTO
public class CreateUserDto
{
    required public string Email { get; set; }
    required public string Username { get; set; }
    required public string Password { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
}

// Output DTO
public class ResponseUserDto
{
    required public string Id { get; set; }
    required public string Email { get; set; }
    required public string Username { get; set; }
}