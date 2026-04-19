using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;

public interface IWaterEntryService
{
    Task<WaterEntryDto> CreateWaterEntry(CreateWaterEntryDto dto, string userId);
    Task<WaterEntryDto?> GetWaterEntry(Guid id, string userId);
    Task<bool> EditWaterEntry(Guid id, UpdateWaterEntryDto dto, string userId);
    Task<bool> DeleteWaterEntry(Guid id, string userId);
}