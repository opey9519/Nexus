using Microsoft.AspNetCore.Mvc;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    // User Interface
    private readonly IAuthService _authService = authService;

    // Create User
    [HttpPost("register")]
    public async Task<IActionResult> CreateUser(CreateUserDto userDto)
    {
        var createdUser = await _authService.CreateUserAsync(userDto);
        return CreatedAtAction(nameof(CreateUser), new { id = createdUser.Id }, createdUser);
    }

    // Log in user & handle JWT + Cookies
    [HttpPost("login")]
    public async Task<IActionResult> LoginUserAsync(LoginUserDto loginDto)
    {
        var (accessToken, refreshToken) = await _authService.LoginUserAsync(loginDto);

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
            var (accessToken, newRefreshToken) = await _authService.RefreshUserAsync(refreshToken);

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
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutUserAsync()
    {
        var refreshToken = Request.Cookies["refresh_token"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.LogoutUserAsync(refreshToken);
        }
        else
        {
            return Unauthorized("Not authorized");
        }

        // Clear Cookies
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");

        return Ok(new { message = "Logged out successfully" });
    }
}