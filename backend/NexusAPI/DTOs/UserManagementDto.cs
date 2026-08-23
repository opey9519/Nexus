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
    required public string Username { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public bool TwoFactorEnabled { get; set; }
    required public string Email { get; set; }

    // Profile information
    public float Height { get; set; }
    public float BodyweightLBS { get; set; }
    public string? ActivityLevel { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UserPutBodyMetricDto
{
    public float? ChangeHeight { get; set; }
    public float? ChangeBodyweightLBS { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}

public class UserPutActivityLevelDto
{
    public string? ChangeActivityLevel { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}