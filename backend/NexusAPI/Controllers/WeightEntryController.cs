using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusAPI.Services.Interfaces;
using NexusAPI.DTOs;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/nutrition/weight-entry")]
[Authorize]
public class WeightEntryController(IBodyweightService bodyweightService) : ControllerBase
{
    private readonly IBodyweightService _bodyweightService = bodyweightService;

    // Retrieve User Id from JWT token
    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpPost]
    public async Task<IActionResult> CreateWeightEntry([FromBody] CreateWeightEntryDto dto)
    {
        var userId = GetUserId();

        var createdWeightEntry = _bodyweightService.CreateWeightEntry(dto, userId);

        return CreatedAtAction(nameof(GetWeightEntry), new { id = createdWeightEntry.Id }, createdWeightEntry);
    }

    [HttpGet("{int:guid}")]
    public async Task<IActionResult> GetWeightEntry(Guid id)
    {
        var userId = GetUserId();

        var gotWeightEntry = _bodyweightService.GetWeightEntry(id, userId);

        if (gotWeightEntry == null)
        {
            return NotFound();
        }

        return Ok(gotWeightEntry);
    }

    [HttpPut("{int:guid}")]
    public async Task<IActionResult> EditWeightEntry(Guid id, [FromBody] UpdateWeightEntryDto dto)
    {
        var userId = GetUserId();

        var editWeightEntry = await _bodyweightService.EditWeightEntry(id, dto, userId);

        if (!editWeightEntry) return NotFound();

        return NoContent();
    }

    [HttpDelete("{int:guid}")]
    public async Task<IActionResult> DeleteWeightEntry(Guid id)
    {
        var userId = GetUserId();

        var deleteWeightEntry = await _bodyweightService.DeleteWeightEntry(id, userId);

        if (!deleteWeightEntry) return NotFound();

        return NoContent();
    }
}