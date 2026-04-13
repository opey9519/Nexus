using NexusAPI.DTOs;
namespace NexusAPI.Services.Interfaces;


public interface IUserService
{
    Task<UserGetResponseDto> GetCurrentUserAsync(string userId);
    Task UpdateCurrentUserAsync(UserPutDto dto, string userId);
    Task DeleteCurrentUserAsync(string userId);
}