// Heart of the app - Starts web server, configures services, defines routes/endpoints

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
// !!!!!!!!!!! Need to create database on psql or spin up on docker
// !!!!!!!!!!! Need to add database connection string on appsettings.Development.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Swagger - API Test/Monitoring Tool 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.MapGet("/", () => "Hello World!");

// Development Environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    // Available at: http://localhost:<port>/swagger
    app.UseSwaggerUI();
}



// Map services
app.MapControllers();

app.Run();