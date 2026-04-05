// Heart of the app - Starts web server, configures services, defines routes/endpoints

using Microsoft.EntityFrameworkCore;
using NexusAPI.Data;
using NexusAPI.Services.Interfaces;
using NexusAPI.Services;
using NexusAPI.Models;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

//// Add Services
// Controllers
builder.Services.AddControllers();

// Services
builder.Services.AddScoped<IUserService, UserService>();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity 
builder.Services.AddIdentity<ApplicationUserModel, IdentityRole>(options =>
{
    // Password rules
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;

    // User rules
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();


// Add Swagger - API Test/Monitoring Tool 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//// Build application
var app = builder.Build();
app.MapGet("/", () => "Hello World!");


//// Environment settings
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Available at: http://localhost:<port>/swagger
}


//// Map settings
app.MapControllers();

// // Verify database connection
// var conn = builder.Configuration.GetConnectionString("DefaultConnection");
// Console.WriteLine($"DB Connection {conn}");


//// Run applicaiton
app.Run();