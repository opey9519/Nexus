namespace NexusAPI.Models;

public class WaterEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserId { get; set; }
    public int AmountML { get; set; }
    public DateTime DrankAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUserModel? User { get; set; }
}