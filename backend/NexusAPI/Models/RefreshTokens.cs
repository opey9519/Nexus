namespace NexusAPI.Models;

public class RefreshToken
{
    public int Id { get; set; }

    required public string Token { get; set; }

    public DateTime Expires { get; set; }

    public bool IsRevoked { get; set; }

    required public string UserId { get; set; }
    required public ApplicationUserModel User { get; set; }
}