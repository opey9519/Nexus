using NexusAPI.DTOs;
using NexusAPI.Models;

namespace NexusAPI.Services.Interfaces;


// Interface for user related requests
public interface IUserService
{
    Task<ResponseUserDto> CreateUserAsync(CreateUserDto user);
    Task<(string accessToken, RefreshToken refreshToken)> LoginUserAsync(LoginUserDto loginInfo);
    Task<(string accessToken, RefreshToken refreshToken)> RefreshUserAsync(string refreshToken);
    Task LogoutUserAsync(string refreshToken);

    //// Implement later
    // Task ChangePasswordAsync();
}