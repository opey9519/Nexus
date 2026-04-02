namespace NexusAPI.DTOs;

public class CreateUserDto
{
    required public string Email { get; set; }
    required public string Username { get; set; }
    required public string Password { get; set; }
}