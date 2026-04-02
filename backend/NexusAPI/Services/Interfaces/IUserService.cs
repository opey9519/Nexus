using NexusAPI.Models;
using NexusAPI.DTOs;

namespace NexusAPI.Services.Interfaces;

public interface IUserService
{
    Task<User> CreateUserAsync(CreateUserDto user);
}