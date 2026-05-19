using System.ComponentModel.DataAnnotations;

namespace NexusAPI.Models;

public class Lifts
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserProfileId { get; set; }
    public required string ExerciseName { get; set; }
    public float WeightLBS { get; set; }
    public int Reps { get; set; }
    public int Sets { get; set; }
    public float? RPE { get; set; }
    public DateTime PerformedAt { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}