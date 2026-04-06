using NexusAPI.Data;
using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace NexusAPI.Services;

public class UserService(ApplicationDbContext context, UserManager<ApplicationUserModel> userManager, TokenService tokenService) : IUserService
{
    // Connection to Database
    private readonly ApplicationDbContext _context = context;
    // Connection to Identity
    private readonly UserManager<ApplicationUserModel> _userManager = userManager;
    // JWT Services
    private readonly TokenService _tokenService = tokenService;


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


    // Login User & register JWT
    public async Task<(string accessToken, RefreshToken refreshToken)> LoginUserAsync(LoginUserDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var accessToken = _tokenService.CreateAccessToken(user);

        var refreshToken = _tokenService.CreateRefreshToken(user.Id, user);
        await _context.RefreshTokens.AddAsync(refreshToken);

        return (accessToken, refreshToken);
    }

    public async Task<(string accessToken, RefreshToken refreshToken)> RefreshUserAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken == null || storedToken.IsRevoked || storedToken.Expires < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid refresh token");

        // Rotate old token 
        storedToken.IsRevoked = true;

        var newRefreshToken = _tokenService.CreateRefreshToken(storedToken.UserId, storedToken.User);

        _context.RefreshTokens.Add(newRefreshToken);

        var newAccessToken = _tokenService.CreateAccessToken(storedToken.User);

        await _context.SaveChangesAsync();

        return (newAccessToken, newRefreshToken);
    }
}