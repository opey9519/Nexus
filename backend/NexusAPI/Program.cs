// Heart of the app - Starts web server, configures services, defines routes/endpoints

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

// Map services
app.MapControllers();

app.Run();