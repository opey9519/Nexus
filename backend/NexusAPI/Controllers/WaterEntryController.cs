using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusAPI.Services.Interfaces;
using NexusAPI.DTOs;

namespace NexusAPI.Controllers;


[ApiController]
[Route("api/nutrition/water-entry")]
[Authorize]
public class WaterEntryController(IWaterEntryService waterEntryService) : ControllerBase
{
    private readonly IWaterEntryService _waterEntryService = waterEntryService;

    // Retrieve User Id from JWT token
    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpPost]
    public async Task<IActionResult> CreateFoodEntry([FromBody] CreateWaterEntryDto dto)
    {
        var userId = GetUserId();

        var createdFoodEntry = _waterEntryService.CreateWaterEntry(dto, userId);

        return CreatedAtAction(nameof(GetWaterEntry), new { id = createdFoodEntry.Id }, createdFoodEntry);
    }

    [HttpGet("{int:guid}")]
    public async Task<IActionResult> GetWaterEntry(Guid id)
    {
        var userId = GetUserId();

        var gotWaterEntry = _waterEntryService.GetWaterEntry(id, userId);
        if (gotWaterEntry == null)
        {
            return NotFound();
        }

        return Ok(gotWaterEntry);
    }

    [HttpPut("{int:guid}")]
    public async Task<IActionResult> EditWaterEntry(Guid id, [FromBody] UpdateWaterEntryDto dto)
    {
        var userId = GetUserId();

        var editWaterEntry = await _waterEntryService.EditWaterEntry(id, dto, userId);
        if (!editWaterEntry) return NotFound();

        return NoContent();
    }

    [HttpDelete("{int:guid}")]
    public async Task<IActionResult> DeleteWaterEntry(Guid id)
    {
        var userId = GetUserId();

        var deleteWaterEntry = await _waterEntryService.DeleteWaterEntry(id, userId);
        if (!deleteWaterEntry) return NotFound();

        return NoContent();
    }
}