using NexusAPI.Data;
using NexusAPI.Models;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Services;

public class UserService(ApplicationDbContext context) : IUserService
{
    // Connection to Database
    private readonly ApplicationDbContext _context = context;

    public async Task<User> CreateUserAsync(CreateUserDto dto)
    {
        // Hash Passwords Later (only fake data for now)
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            Username = dto.Username,
            PasswordHash = dto.Password // !!!!!!! Not secure, fix!!!!!!!
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }
}