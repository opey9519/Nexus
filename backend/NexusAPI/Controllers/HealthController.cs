using Microsoft.AspNetCore.Mvc;


namespace NexusAPI.Controllers;


// Verifies Heatlh of API
[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("API is running");
    }
}