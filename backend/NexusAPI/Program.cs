// Heart of the app - Starts web server, configures services, defines routes/endpoints

using Microsoft.EntityFrameworkCore;
using NexusAPI.Data;
using NexusAPI.Services.Interfaces;
using NexusAPI.Services;

var builder = WebApplication.CreateBuilder(args);


// Add services
builder.Services.AddControllers();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// Add Swagger - API Test/Monitoring Tool 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Build application
var app = builder.Build();
app.MapGet("/", () => "Hello World!");


// Development Environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Available at: http://localhost:<port>/swagger
}


// Map services
app.MapControllers();

// // Verify database connection
// var conn = builder.Configuration.GetConnectionString("DefaultConnection");
// Console.WriteLine($"DB Connection {conn}");

app.Run();