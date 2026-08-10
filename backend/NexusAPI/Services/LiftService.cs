using NexusAPI.DTOs;
using NexusAPI.Data;
using NexusAPI.Models;
using NexusAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace NexusAPI.Services;

public class LiftService(ApplicationDbContext context) : ILiftService
{
    private readonly ApplicationDbContext _context = context;

    private static LiftEntryDto MapToDto(LiftEntry entity)
    {
        // Map Model to Dto
        return new LiftEntryDto
        {
            Id = entity.Id,
            ExerciseName = entity.ExerciseName,
            WeightLBS = entity.WeightLBS,
            Reps = entity.Reps,
            Sets = entity.Sets,
            RPE = entity.RPE,
            PerformedAt = entity.PerformedAt,
            Notes = entity.Notes
        };
    }

    public async Task<LiftEntryDto> CreateLift(CreateLiftDto dto, string userId)
    {
        // Create new lift
        var newLift = new LiftEntry
        {
            UserId = userId,
            ExerciseName = dto.ExerciseName,
            WeightLBS = dto.WeightLBS,
            Reps = dto.Reps,
            Sets = dto.Sets,
            RPE = dto.RPE,
            PerformedAt = dto.PerformedAt,
            Notes = dto.Notes
        };

        await _context.Lifts.AddAsync(newLift);
        await _context.SaveChangesAsync();

        // Map Model to Dto
        return MapToDto(newLift);
    }

    public async Task<IEnumerable<LiftEntryDto>> GetLifts(string userId)
    {
        // Find all lifts that belong to the user
        var lifts = await _context.Lifts
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.PerformedAt)
            .ToListAsync();

        return lifts.Select(MapToDto);
    }

    public async Task<LiftEntryDto?> GetLift(Guid id, string userId)
    {
        // Find lift that matches id + belongs to user
        var lift = await _context.Lifts
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

        return lift == null ? null : MapToDto(lift);
    }

    public async Task<bool> EditLift(Guid id, UpdateLiftEntryDto dto, string userId)
    {
        // Find lift that matches id + belongs to user
        var lift = await _context.Lifts
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

        if (lift == null) return false;

        // Update lift fields if changed & not null or else keep same
        lift.ExerciseName = dto.ExerciseName ?? lift.ExerciseName;
        lift.WeightLBS = dto.WeightLBS ?? lift.WeightLBS;
        lift.Reps = dto.Reps ?? lift.Reps;
        lift.Sets = dto.Sets ?? lift.Sets;
        lift.RPE = dto.RPE ?? lift.RPE;
        lift.PerformedAt = dto.PerformedAt ?? lift.PerformedAt;
        lift.Notes = dto.Notes ?? lift.Notes;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteLift(Guid id, string userId)
    {
        // Find lift that matches id + belongs to user
        var lift = await _context.Lifts
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

        if (lift == null) return false;

        _context.Lifts.Remove(lift);
        await _context.SaveChangesAsync();

        return true;
    }
}