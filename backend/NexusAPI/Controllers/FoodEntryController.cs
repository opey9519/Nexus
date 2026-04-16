using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using NexusAPI.DTOs;
using NexusAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace NexusAPI.Controllers;

[ApiController]
[Route("api/food-entry")]
[Authorize]
public class FoodEntryController(IFoodEntryService foodEntryService) : ControllerBase
{
    private readonly IFoodEntryService _foodEntryService = foodEntryService;

    // Retrieve User Id from JWT token
    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpPost]
    public async Task<IActionResult> CreateFoodEntry(CreateFoodEntryDto dto)
    {
        var userId = GetUserId();

        var createdFoodEntry = _foodEntryService.CreateFoodEntry(dto, userId);

        return CreatedAtAction(nameof(GetSpecificFood), new { id = createdFoodEntry.Id }, createdFoodEntry);
    }

    [HttpGet]
    public async Task<IActionResult> GetFood()
    {
        var userId = GetUserId();

        var gotAllFoodEntry = _foodEntryService.GetFood(userId);

        return Ok(gotAllFoodEntry);
    }

    [HttpGet("{int:guid}")]
    public async Task<IActionResult> GetSpecificFood(Guid id)
    {
        var userId = GetUserId();

        var gotFoodEntry = _foodEntryService.GetSpecificFood(id, userId);
        if (gotFoodEntry == null)
        {
            return NotFound();
        }

        return Ok(gotFoodEntry);
    }

    [HttpPut("{int:guid}")]
    public async Task<IActionResult> EditFoodEntry(Guid id, [FromBody] UpdateFoodEntryDto dto)
    {
        var userId = GetUserId();

        var editFoodEntry = await _foodEntryService.EditFoodEntry(id, dto, userId);
        if (!editFoodEntry) return NotFound();

        return NoContent();
    }

    [HttpDelete("{int:guid}")]
    public async Task<IActionResult> DeleteFoodEntry(Guid id)
    {
        var userId = GetUserId();

        var deleteFoodEntry = await _foodEntryService.DeleteFoodEntry(id, userId);
        if (!deleteFoodEntry) return NotFound();

        return NoContent();
    }
}