using Microsoft.AspNetCore.Mvc;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/user")]
public class UserController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var userData = await _userService.GetUserByIdAsync(id);
        return Ok(new { message = "User Retrieved", userData });
    }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> PutUser(string id)
    // {
    //     // var userD
    // }
}