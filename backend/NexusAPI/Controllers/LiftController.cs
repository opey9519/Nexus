// using System.Security.Claims;
// using Microsoft.AspNetCore.Mvc;
// using NexusAPI.DTOs;
// using NexusAPI.Services.Interfaces;
// using Microsoft.AspNetCore.Authorization;

// namespace NexusAPI.Controllers;

// [ApiController]
// [Route("api/lifts")]
// public class LiftController(ILiftService liftService) : ControllerBase
// {
//     private readonly ILiftService _liftService = liftService;

//     // Retrieve User Id from JWT token
//     private string GetUserId()
//     {
//         return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
//     }

//     [HttpPost]
//     public async Task<IActionResult> CreateLift([FromBody] CreateLiftDto dto)
//     {

//     }

//     [HttpGet]
//     public async Task<IActionResult> GetLifts()
//     {

//     }

//     [HttpGet("{int:guid}")]
//     public async Task<IActionResult> GetLift(Guid id)
//     {

//     }

//     [HttpPut("{int:guid}")]
//     public async Task<IActionResult> EditLift(Guid id, [FromBody] UpdateLiftEntryDto dto)
//     {

//     }

//     [HttpDelete("{int:guid}")]
//     public async Task<IActionResult> DeleteLift(Guid)
//     {

//     }
// }