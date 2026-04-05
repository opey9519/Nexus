using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;


// Interface for user related requests
public interface IUserService
{
    Task<ResponseUserDto> CreateUserAsync(CreateUserDto user);

    /// Sign in
    /// Sign out
    /// Change Password
}