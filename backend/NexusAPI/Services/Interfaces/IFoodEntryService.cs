using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;

public interface IFoodEntryService
{
    // Create food
    Task<FoodEntryDto> CreateFoodEntry(CreateFoodEntryDto dto, string userId);
    // Get food
    Task<IEnumerable<FoodEntryDto>> GetFood(string userId);
    // Get specific food
    Task<FoodEntryDto?> GetSpecificFood(Guid id, string userId);
    // Edit food
    Task<bool> EditFoodEntry(Guid id, UpdateFoodEntryDto dto, string userId);
    // Delete food
    Task<bool> DeleteFoodEntry(Guid id, string userId);
}