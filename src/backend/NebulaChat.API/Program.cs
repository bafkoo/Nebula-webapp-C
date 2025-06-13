using NebulaChat.Infrastructure;
using NebulaChat.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Infrastructure services (DbContext, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Add application services
builder.Services.AddScoped<IPasswordService, PasswordService>();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // Vite dev server
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
