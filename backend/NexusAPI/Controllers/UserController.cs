using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class UserController(IUserService userService) : ControllerBase
{
    // User Interface
    private readonly IUserService _userService = userService;

    // Create User
    [HttpPost("/register")]
    public async Task<IActionResult> CreateUser(CreateUserDto userDto)
    {
        var createdUser = await _userService.CreateUserAsync(userDto);
        return CreatedAtAction(nameof(CreateUser), new { id = createdUser.Id }, createdUser);
    }

    // Log in user & handle JWT + Cookies
    [HttpPost("/login")]
    public async Task<IActionResult> LoginUserAsync(LoginUserDto loginDto)
    {
        var (accessToken, refreshToken) = await _userService.LoginUserAsync(loginDto);

        Response.Cookies.Append("access_token", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(15)
        });

        Response.Cookies.Append("refresh_token", refreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = refreshToken.Expires
        });

        return Ok(new { message = "Login successful" });
    }

    // Refresh User
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];

        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

        try
        {
            var (accessToken, newRefreshToken) = await _userService.RefreshUserAsync(refreshToken);

            Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("refresh_token", newRefreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = newRefreshToken.Expires
            });

            return Ok(new { message = "Token refreshed" });
        }
        catch
        {
            return Unauthorized();
        }
    }

    // Logout User
    [Authorize]
    [HttpPost("/logout")]
    public async Task<IActionResult> LogoutUserAsync()
    {
        var refreshToken = Request.Cookies["refresh_token"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _userService.LogoutUserAsync(refreshToken);
        }

        // Clear Cookies
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");

        return Ok(new { message = "Logged out successfully" });
    }
}