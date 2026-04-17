namespace NexusAPI.DTOs;


public class CreateWaterEntryDto
{
    public int AmountML { get; set; }
    public DateTime DrankAt { get; set; }
}

public class WaterEntryDto
{
    public Guid Id { get; set; }
    public int AmountML { get; set; }
    public DateTime DrankAt { get; set; }
}

public class UpdateWaterEntryDto
{
    public int? AmountML { get; set; }
    public DateTime? DrankAt { get; set; }
}