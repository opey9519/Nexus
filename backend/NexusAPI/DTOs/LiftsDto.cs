namespace NexusAPI.DTOs;

public class CreateLiftDto
{
    public required string ExerciseName { get; set; }
    public float WeightLBS { get; set; }
    public int Reps { get; set; }
    public int Sets { get; set; }
    public float? RPE { get; set; }
    public DateTime PerformedAt { get; set; }
    public string? Notes { get; set; }
}

public class LiftEntryDto
{
    public Guid Id { get; set; }
    public required string ExerciseName { get; set; }
    public float WeightLBS { get; set; }
    public int Reps { get; set; }
    public int Sets { get; set; }
    public float? RPE { get; set; }
    public DateTime PerformedAt { get; set; }
    public string? Notes { get; set; }
}

public class UpdateLiftEntryDto
{
    public string? ExerciseName { get; set; }
    public float? WeightLBS { get; set; }
    public int? Reps { get; set; }
    public int? Sets { get; set; }
    public float? RPE { get; set; }
    public DateTime? PerformedAt { get; set; }
    public string? Notes { get; set; }
}