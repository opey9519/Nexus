namespace NexusAPI.DTOs;

// Input DTO
public class UserPutDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    required public string Email { get; set; }
}

// Output DTO
public class UserGetResponseDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public bool TwoFactorEnabled { get; set; }
    required public string Email { get; set; }
}