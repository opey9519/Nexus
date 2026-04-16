using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;

public interface IFoodEntryService
{
    // Create food
    Task<FoodEntryDto> CreateFoodEntry(CreateFoodEntryDto dto);
    // Get food
    Task<IEnumerable<FoodEntryDto>> GetFood(string userId);
    // Get specific food
    Task<FoodEntryDto?> GetSpecificFood(Guid id, string userId);
    // Edit food
    Task EditFoodEntry();
    // Delete food
    Task DeleteFoodEntry();
}