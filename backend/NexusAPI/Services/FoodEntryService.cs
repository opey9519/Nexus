using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Data;
using NexusAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace NexusAPI.Services;

public class FoodEntryService(ApplicationDbContext context) : IFoodEntryService
{
    private readonly ApplicationDbContext _context = context;

    private static FoodEntryDto MapToDto(FoodEntry entity)
    {
        return new FoodEntryDto
        {
            Id = entity.Id,
            FoodName = entity.FoodName,
            Calories = entity.Calories,
            Protein = entity.Protein,
            Carbohydrates = entity.Carbohydrates,
            Fats = entity.Fats,
            EatenAt = entity.EatenAt
        };
    }

    public async Task<FoodEntryDto> CreateFoodEntry(CreateFoodEntryDto dto, string userProfileId)
    {
        // Create new food entry
        var newFood = new FoodEntry
        {
            UserProfileId = userProfileId,
            FoodName = dto.FoodName,
            Calories = dto.Calories,
            Protein = dto.Protein,
            Carbohydrates = dto.Carbohydrates,
            Fats = dto.Fats,
            EatenAt = dto.EatenAt
        };

        await _context.FoodEntry.AddAsync(newFood);
        await _context.SaveChangesAsync();

        // Map Model to Dto
        return MapToDto(newFood);
    }

    public async Task<IEnumerable<FoodEntryDto>> GetFood(string userProfileId)
    {
        // Find Food entry that matches id + belongs to user
        var FoodEntry = await _context.FoodEntry
            .Where(f => f.UserProfileId == userProfileId)
            .OrderByDescending(f => f.EatenAt)
            .ToListAsync();

        // Map Model to Dto
        return FoodEntry.Select(MapToDto);
    }

    public async Task<FoodEntryDto?> GetSpecificFood(Guid id, string userProfileId)
    {
        // Find Food entry that matches id + belongs to user
        var foodEntry = await _context.FoodEntry
            .FirstOrDefaultAsync(f => f.Id == id && f.UserProfileId == userProfileId);

        // Map Model to Dto if not null
        return foodEntry == null ? null : MapToDto(foodEntry);
    }

    public async Task<bool> EditFoodEntry(Guid id, UpdateFoodEntryDto dto, string userProfileId)
    {
        // Find Food entry that matches id + belongs to user
        var foodEntry = await _context.FoodEntry
            .FirstOrDefaultAsync(f => f.Id == id && f.UserProfileId == userProfileId);

        if (foodEntry == null) return false;

        foodEntry.FoodName = dto.FoodName ?? foodEntry.FoodName;
        foodEntry.Calories = dto.Calories ?? foodEntry.Calories;
        foodEntry.Protein = dto.Protein ?? foodEntry.Protein;
        foodEntry.Carbohydrates = dto.Carbohydrates ?? foodEntry.Carbohydrates;
        foodEntry.Fats = dto.Fats ?? foodEntry.Fats;
        foodEntry.EatenAt = dto.EatenAt ?? foodEntry.EatenAt;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteFoodEntry(Guid id, string userProfileId)
    {
        // Find Food entry that matches id + belongs to user
        var foodEntry = await _context.FoodEntry
            .FirstOrDefaultAsync(f => f.Id == id && f.UserProfileId == userProfileId);

        if (foodEntry == null) return false;

        _context.FoodEntry.Remove(foodEntry);

        return true;
    }
}