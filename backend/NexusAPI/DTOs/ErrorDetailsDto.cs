namespace NexusAPI.DTOs;

public class ErrorDetailsDto
{
    public int StatusCode { get; set; }
    public string? Message { get; set; }
    public string? Detail { get; set; }
}