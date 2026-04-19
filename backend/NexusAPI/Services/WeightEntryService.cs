using Microsoft.EntityFrameworkCore;
using NexusAPI.Models;
using NexusAPI.Data;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Services;

public class WeightEntryService(ApplicationDbContext context) : IBodyweightService
{
    private readonly ApplicationDbContext _context = context;

    private static WeightEntryDto MapToDto(BodyweightEntries entity)
    {
        return new WeightEntryDto
        {
            Id = entity.Id,
            BodyweightLBS = entity.BodyweightLBS,
            WeighedAt = entity.WeighedAt
        };
    }

    public async Task<WeightEntryDto> CreateWeightEntry(CreateWeightEntryDto dto, string userId)
    {
        // Create new weight entry
        var newWeightEntry = new BodyweightEntries
        {
            UserId = userId,
            BodyweightLBS = dto.BodyweightLBS,
            WeighedAt = dto.WeighedAt
        };

        await _context.BodyweightEntries.AddAsync(newWeightEntry);
        await _context.SaveChangesAsync();

        return MapToDto(newWeightEntry);
    }

    public async Task<WeightEntryDto?> GetWeightEntry(Guid id, string userId)
    {
        // Find Weight entry that matches id + belongs to user
        var weightEntry = await _context.BodyweightEntries
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        return weightEntry == null ? null : MapToDto(weightEntry);
    }

    public async Task<bool> EditWeightEntry(Guid id, UpdateWeightEntryDto dto, string userId)
    {
        // Find Weight entry that matches id + belongs to user
        var weightEntry = await _context.BodyweightEntries
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (weightEntry == null) return false;

        weightEntry.BodyweightLBS = dto.BodyweightLBS ?? weightEntry.BodyweightLBS;
        weightEntry.WeighedAt = dto.WeighedAt ?? weightEntry.WeighedAt;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteWeightEntry(Guid id, string userId)
    {
        // Find Weight entry that matches id + belongs to user
        var weightEntry = await _context.BodyweightEntries
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (weightEntry == null) return false;

        _context.BodyweightEntries.Remove(weightEntry);
        await _context.SaveChangesAsync();

        return true;
    }
}