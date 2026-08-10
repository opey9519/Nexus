using System.ComponentModel.DataAnnotations;

namespace NexusAPI.Models;

public class BodyweightEntry
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserId { get; set; }
    public float BodyweightLBS { get; set; }
    public DateTime WeighedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUserModel? User { get; set; }
}