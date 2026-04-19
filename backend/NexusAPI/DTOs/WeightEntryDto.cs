namespace NexusAPI.DTOs;

public class WeightEntryDto
{
    public Guid Id { get; set; }
    public float BodyweightLBS { get; set; }
    public DateTime WeighedAt { get; set; }
}

public class CreateWeightEntryDto
{
    public float BodyweightLBS { get; set; }
    public DateTime WeighedAt { get; set; }
}

public class UpdateWeightEntryDto
{
    public float? BodyweightLBS { get; set; }
    public DateTime? WeighedAt { get; set; }
}