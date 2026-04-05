using Microsoft.AspNetCore.Mvc;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/user")]
public class UserController(IUserService userService) : ControllerBase
{
    // User Interface
    private readonly IUserService _userService = userService;

    // Create User
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto userDto)
    {
        var createdUser = await _userService.CreateUserAsync(userDto);
        return CreatedAtAction(nameof(CreateUser), new { id = createdUser.Id }, createdUser);
    }
}