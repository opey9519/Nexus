using Microsoft.AspNetCore.Http.HttpResults;
using NexusAPI.DTOs;
using System.Net;
using System.Text.Json;

namespace NexusAPI.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionMiddleware> _logger = logger;
    private readonly IHostEnvironment _env = env;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An unhandled exception occurred: {ex.Message}");
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        int statusCode = (int)HttpStatusCode.InternalServerError;
        string message = "An unexpected error occurred.";

        if (ex is ArgumentException)
        {
            statusCode = (int)HttpStatusCode.BadRequest;
            message = "Missing required parameter.";
        }
        else if (ex is UnauthorizedAccessException)
        {
            statusCode = (int)HttpStatusCode.Unauthorized;
            message = "Access is denied.";
        }


        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var errorDetails = new ErrorDetailsDto
        {
            StatusCode = statusCode,
            Message = message,
            Detail = _env.IsDevelopment() ? ex.StackTrace : null
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(errorDetails));
    }
}