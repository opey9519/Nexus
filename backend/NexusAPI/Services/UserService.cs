using NexusAPI.Data;
using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace NexusAPI.Services;

public class UserService(ApplicationDbContext context, UserManager<ApplicationUserModel> userManager) : IUserService
{
    // Connection to Database
    private readonly ApplicationDbContext _context = context;
    // Connection to Identity
    private readonly UserManager<ApplicationUserModel> _userManager = userManager;


    // Create User & Hash Password
    public async Task<ResponseUserDto> CreateUserAsync(CreateUserDto dto)
    {
        // Create new user object
        var user = new ApplicationUserModel
        {
            Email = dto.Email,
            UserName = dto.Username,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            CreatedAt = DateTime.UtcNow
        };
        var result = await _userManager.CreateAsync(user, dto.Password); // Hashes password & adds to database

        if (!result.Succeeded) throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        return new ResponseUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.UserName
        };
    }
}