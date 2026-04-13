using NexusAPI.DTOs;
namespace NexusAPI.Services.Interfaces;


public interface IUserService
{
    Task<UserGetResponseDto> GetUserByIdAsync(string id);
}