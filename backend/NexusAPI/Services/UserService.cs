using NexusAPI.Data;
using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace NexusAPI.Services;

public class UserService(ApplicationDbContext context, UserManager<ApplicationUserModel> userManager, TokenService tokenService) : IUserService
{
    private readonly ApplicationDbContext _context = context;
    private readonly UserManager<ApplicationUserModel> _userManager = userManager;
    private readonly TokenService _tokenService = tokenService;

    public async Task<UserGetResponseDto> GetUserByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

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
}