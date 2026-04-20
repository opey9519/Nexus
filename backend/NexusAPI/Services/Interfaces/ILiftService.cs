using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;

public interface ILiftService
{
    Task<LiftEntryDto> CreateLift(CreateLiftDto dto, string userId);
    Task<IEnumerable<LiftEntryDto>> GetLifts(string userId);
    Task<LiftEntryDto?> GetLift(Guid id, string userId);
    Task<bool> EditLift(Guid id, UpdateLiftEntryDto dto, string userId);
    Task<bool> DeleteLift(Guid id, string userId);
}