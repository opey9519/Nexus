using Microsoft.EntityFrameworkCore;
using NexusAPI.Models;
using NexusAPI.Data;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Services;

public class WeightEntryService(ApplicationDbContext context) : IBodyweightService
{
    private readonly ApplicationDbContext _context = context;

    private static WeightEntryDto MapToDto(BodyweightEntry entity)
    {
        return new WeightEntryDto
        {
            Id = entity.Id,
            BodyweightLBS = entity.BodyweightLBS,
            WeighedAt = entity.WeighedAt
        };
    }

    public async Task<WeightEntryDto> CreateWeightEntry(CreateWeightEntryDto dto, string userProfileId)
    {
        // Create new weight entry
        var newWeightEntry = new BodyweightEntry
        {
            UserProfileId = userProfileId,
            BodyweightLBS = dto.BodyweightLBS,
            WeighedAt = dto.WeighedAt
        };

        await _context.BodyweightEntry.AddAsync(newWeightEntry);
        await _context.SaveChangesAsync();

        return MapToDto(newWeightEntry);
    }

    public async Task<WeightEntryDto?> GetWeightEntry(Guid id, string userProfileId)
    {
        // Find Weight entry that matches id + belongs to user
        var weightEntry = await _context.BodyweightEntry
            .FirstOrDefaultAsync(w => w.Id == id && w.UserProfileId == userProfileId);

        return weightEntry == null ? null : MapToDto(weightEntry);
    }

    public async Task<bool> EditWeightEntry(Guid id, UpdateWeightEntryDto dto, string userProfileId)
    {
        // Find Weight entry that matches id + belongs to user
        var weightEntry = await _context.BodyweightEntry
            .FirstOrDefaultAsync(w => w.Id == id && w.UserProfileId == userProfileId);

        if (weightEntry == null) return false;

        weightEntry.BodyweightLBS = dto.BodyweightLBS ?? weightEntry.BodyweightLBS;
        weightEntry.WeighedAt = dto.WeighedAt ?? weightEntry.WeighedAt;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteWeightEntry(Guid id, string userProfileId)
    {
        // Find Weight entry that matches id + belongs to user
        var weightEntry = await _context.BodyweightEntry
            .FirstOrDefaultAsync(w => w.Id == id && w.UserProfileId == userProfileId);

        if (weightEntry == null) return false;

        _context.BodyweightEntry.Remove(weightEntry);
        await _context.SaveChangesAsync();

        return true;
    }
}