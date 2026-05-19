using System.ComponentModel.DataAnnotations;

namespace NexusAPI.Models;

public class BodyweightEntries
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserProfileId { get; set; }
    public float BodyweightLBS { get; set; }
    public DateTime WeighedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}