using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/lifts")]
[Authorize]
public class LiftController(ILiftService liftService) : ControllerBase
{
    private readonly ILiftService _liftService = liftService;

    // Retrieve User Id from JWT token
    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLift([FromBody] CreateLiftDto dto)
    {
        var userId = GetUserId();

        var createdLift = await _liftService.CreateLift(dto, userId);
        return CreatedAtAction(nameof(GetLift), new { id = createdLift.Id }, createdLift);
    }

    [HttpGet]
    public async Task<IActionResult> GetLifts()
    {
        var userId = GetUserId();

        var lifts = await _liftService.GetLifts(userId);
        return Ok(lifts);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetLift(Guid id)
    {
        var userId = GetUserId();

        var lift = await _liftService.GetLift(id, userId);
        if (lift == null)
        {
            return NotFound();
        }

        return Ok(lift);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> EditLift(Guid id, [FromBody] UpdateLiftEntryDto dto)
    {
        var userId = GetUserId();

        var editLift = await _liftService.EditLift(id, dto, userId);
        if (!editLift) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteLift(Guid id)
    {
        var userId = GetUserId();

        var deleteLift = await _liftService.DeleteLift(id, userId);
        if (!deleteLift) return NotFound();

        return NoContent();
    }
}