namespace NexusAPI.DTOs;

// Input DTO
public class CreateUserDto
{
    required public string Email { get; set; }
    required public string Username { get; set; }
    required public string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

// Output DTO
public class ResponseUserDto
{
    required public string Id { get; set; }
    required public string Email { get; set; }
    required public string Username { get; set; }
}

// Input DTO
public class LoginUserDto
{
    required public string Email { get; set; }
    required public string Password { get; set; }
}
