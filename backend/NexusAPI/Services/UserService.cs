using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;
using NexusAPI.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace NexusAPI.Services;

public class UserService(UserManager<ApplicationUserModel> userManager, ApplicationDbContext context) : IUserService
{
    private readonly UserManager<ApplicationUserModel> _userManager = userManager;
    private readonly ApplicationDbContext _context = context;

    // Retrieves basic user information by Id
    public async Task<UserGetResponseDto> GetCurrentUserAsync(string userId)
    {
        var user = await _context.Users
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new InvalidOperationException("User not found");

        var response = new UserGetResponseDto
        {
            Username = user.UserName!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            TwoFactorEnabled = user.TwoFactorEnabled,
            Email = user.Email!,
            Height = user.UserProfile?.Height ?? 0,
            BodyweightLBS = user.UserProfile?.BodyWeightLBS ?? 0,
            ActivityLevel = user.UserProfile?.ActivityLevel,
            CreatedAt = user.CreatedAt
        };

        return response;
    }

    // Updates basic user information by id
    public async Task UpdateCurrentUserAsync(UserPutDto dto, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) throw new InvalidOperationException("User not found");

        user.FirstName = dto.FirstName ?? user.FirstName;
        user.LastName = dto.LastName ?? user.LastName;
        user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;

        if (!string.IsNullOrEmpty(dto.Email) && dto.Email != user.Email)
        {
            var token = await _userManager.GenerateChangeEmailTokenAsync(user, dto.Email);
            var changeEmailResult = await _userManager.ChangeEmailAsync(user, dto.Email, token);

            if (!changeEmailResult.Succeeded)
                throw new ArgumentException("Failed to update email");
        }

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) throw new ArgumentException("Failed to edit user");
    }

    // Deletes user by id
    public async Task DeleteCurrentUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new InvalidOperationException("User not found");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) throw new ArgumentException("Failed to edit user");
    }

    // Updates user body metrics by id
    public async Task PatchCurrentUserBodyMetricAsync(UserPutBodyMetricDto dto, string userId)
    {
        if (!dto.ChangeHeight.HasValue && !dto.ChangeBodyweightLBS.HasValue)
        {
            throw new ArgumentException("No body metric values were provided");
        }

        if (dto.ChangeHeight.HasValue && (dto.ChangeHeight.Value <= 0 || dto.ChangeHeight.Value > 280))
        {
            throw new ArgumentException("Height must be greater than 0 and at most 280 cm");
        }

        if (dto.ChangeBodyweightLBS.HasValue && (dto.ChangeBodyweightLBS.Value <= 0 || dto.ChangeBodyweightLBS.Value > 1000))
        {
            throw new ArgumentException("Bodyweight must be greater than 0 and at most 1000 lbs");
        }

        var user = await _context.Users
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new InvalidOperationException("User not found");

        // Accounts created before profiles were enforced may be missing one
        var profile = user.UserProfile;

        if (profile == null)
        {
            profile = new UserProfile
            {
                UserId = user.Id
            };

            user.UserProfile = profile;
            _context.UserProfile.Add(profile);
        }

        if (dto.ChangeHeight.HasValue) profile.Height = dto.ChangeHeight.Value;
        if (dto.ChangeBodyweightLBS.HasValue) profile.BodyWeightLBS = dto.ChangeBodyweightLBS.Value;

        await _context.SaveChangesAsync();
    }

    // Updates user activity level by id
    public async Task PatchCurrentUserActivityLevelAsync(UserPutActivityLevelDto dto, string userId)
    {
        var validLevels = new[] { "Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active" };

        if (string.IsNullOrWhiteSpace(dto.ChangeActivityLevel))
        {
            throw new ArgumentException("An activity level is required");
        }

        if (!validLevels.Contains(dto.ChangeActivityLevel))
        {
            throw new ArgumentException("Invalid activity level");
        }

        var user = await _context.Users
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new InvalidOperationException("User not found");

        // Accounts created before profiles were enforced may be missing one
        var profile = user.UserProfile;

        if (profile == null)
        {
            profile = new UserProfile
            {
                UserId = user.Id
            };

            user.UserProfile = profile;
            _context.UserProfile.Add(profile);
        }

        profile.ActivityLevel = dto.ChangeActivityLevel;

        await _context.SaveChangesAsync();
    }
}