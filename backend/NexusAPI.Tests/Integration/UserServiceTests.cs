using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using NexusAPI.DTOs;
using NexusAPI.Tests.Infrastructure;

namespace NexusAPI.Tests.Integration;

public class UserServiceTests(WebApplicationFactory factory) : IntegrationTestBase(factory)
{

    // Test returns OK (200) when user is found 
    [Fact]
    public async Task GetMe_ReturnsOk_WhenValidUser()
    {

    }

    // Test returns Bad Request (400) when error occurs
    [Fact]
    public async Task GetMe_ReturnsUnauthorized_WhenNotLoggedIn()
    {

    }

    [Fact]
    public async Task UpdateUser_ReturnsOk_WhenValidUser()
    {

    }

    [Fact]
    public async Task UpdateUser_ReturnsBadRequest_WhenInvalidUser()
    {

    }

    [Fact]
    public async Task DeleteUser_ReturnsOk_WhenValidUser()
    {

    }

    [Fact]
    public async Task DeleteUser_ReturnsBadRequest_WhenInvalidUser()
    {

    }
}