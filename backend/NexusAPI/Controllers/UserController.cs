using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? throw new UnauthorizedAccessException();
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetUser()
    {
        var userId = GetUserId();

        var userData = await _userService.GetCurrentUserAsync(userId);
        return Ok(new { message = "User Retrieved", userData });
    }

    [HttpPut("me")]
    public async Task<IActionResult> PutUser(UserPutDto dto)
    {
        var userId = GetUserId();

        await _userService.UpdateCurrentUserAsync(dto, userId);
        return Ok(new { message = "User Updated" });
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = GetUserId();

        await _userService.DeleteCurrentUserAsync(userId);
        return Ok(new { message = "User Deleted" });
    }
}