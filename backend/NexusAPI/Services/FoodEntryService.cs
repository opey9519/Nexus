using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Data;
using NexusAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace NexusAPI.Services;

public class FoodEntryService(ApplicationDbContext context) : IFoodEntryService
{
    private readonly ApplicationDbContext _context = context;

    private static FoodEntryDto MapToDto(FoodEntries entity)
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

    public async Task<FoodEntryDto> CreateFoodEntry(CreateFoodEntryDto dto)
    {
        var newFood = new FoodEntries
        {
            UserId = "Temp_User",
            FoodName = dto.FoodName,
            Calories = dto.Calories,
            Protein = dto.Protein,
            Carbohydrates = dto.Carbohydrates,
            Fats = dto.Fats,
            EatenAt = dto.EatenAt
        };

        _context.FoodEntries.Add(newFood);
        await _context.SaveChangesAsync();

        return MapToDto(newFood);
    }

    public async Task<IEnumerable<FoodEntryDto>> GetFood(string userId)
    {
        var foodEntries = await _context.FoodEntries
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.EatenAt)
            .ToListAsync();

        return foodEntries.Select(MapToDto);
    }

    public async Task<FoodEntryDto?> GetSpecificFood(Guid id, string userId)
    {
        var foodEntry = await _context.FoodEntries
            .FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

        return foodEntry == null ? null : MapToDto(foodEntry);
    }

    public async Task EditFoodEntry()
    {

    }

    public async Task DeleteFoodEntry()
    {

    }
}