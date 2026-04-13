using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace NexusAPI.Services;

public class UserService(UserManager<ApplicationUserModel> userManager, TokenService tokenService) : IUserService
{
    private readonly UserManager<ApplicationUserModel> _userManager = userManager;
    private readonly TokenService _tokenService = tokenService;

    // Retrieves basic user information by Id
    public async Task<UserGetResponseDto> GetCurrentUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) throw new InvalidOperationException("User not found");

        var response = new UserGetResponseDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            TwoFactorEnabled = user.TwoFactorEnabled,
            Email = user.Email!
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
}