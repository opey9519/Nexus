namespace NexusAPI.Models;

public class WaterEntries
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserProfileId { get; set; }
    public int AmountML { get; set; }
    public DateTime DrankAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}