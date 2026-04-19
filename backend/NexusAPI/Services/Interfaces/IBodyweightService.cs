using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;

public interface IBodyweightService
{
    Task<WeightEntryDto> CreateWeightEntry(CreateWeightEntryDto dto, string userId);
    Task<WeightEntryDto?> GetWeightEntry(Guid id, string userId);
    Task<bool> EditWeightEntry(Guid id, UpdateWeightEntryDto dto, string userId);
    Task<bool> DeleteWeightEntry(Guid id, string userId);
}