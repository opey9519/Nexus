using Microsoft.EntityFrameworkCore;
using NexusAPI.Data;
using NexusAPI.DTOs;
using NexusAPI.Models;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Services;

public class WaterEntryService(ApplicationDbContext context) : IWaterEntryService
{
    private readonly ApplicationDbContext _context = context;

    private static WaterEntryDto MapToDto(WaterEntries entity)
    {
        return new WaterEntryDto
        {
            Id = entity.Id,
            AmountML = entity.AmountML,
            DrankAt = entity.DrankAt
        };
    }

    public async Task<WaterEntryDto> CreateWaterEntry(CreateWaterEntryDto dto, string userId)
    {
        // Create new water entry
        var newWaterEntry = new WaterEntries
        {
            UserId = userId,
            AmountML = dto.AmountML,
            DrankAt = dto.DrankAt
        };

        await _context.WaterEntries.AddAsync(newWaterEntry);
        await _context.SaveChangesAsync();

        // Map Model to Dto
        return MapToDto(newWaterEntry);
    }

    public async Task<WaterEntryDto?> GetWaterEntry(Guid id, string userId)
    {
        // Find Water entry that matches id + belongs to user
        var waterEntry = await _context.WaterEntries
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        // Map Model to Dto
        return waterEntry == null ? null : MapToDto(waterEntry);
    }

    public async Task<bool> EditWaterEntry(Guid id, UpdateWaterEntryDto dto, string userId)
    {
        // Find Water entry that matches id + belongs to user
        var waterEntry = await _context.WaterEntries
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (waterEntry == null) return false;

        // Update Water entry if changed & not null or else keep same
        waterEntry.AmountML = dto.AmountML ?? waterEntry.AmountML;
        waterEntry.DrankAt = dto.DrankAt ?? waterEntry.DrankAt;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteWaterEntry(Guid id, string userId)
    {
        // Find Water entry that matches id + belongs to user
        var waterEntry = await _context.WaterEntries
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (waterEntry == null) return false;

        _context.WaterEntries.Remove(waterEntry);
        await _context.SaveChangesAsync();

        return true;
    }
}