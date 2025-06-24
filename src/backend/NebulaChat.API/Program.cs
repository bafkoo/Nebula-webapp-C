using NebulaChat.Infrastructure;
using NebulaChat.API.Services;
using NebulaChat.API.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Resend;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using System.Reflection;
using AutoMapper;
using NebulaChat.API.Services.Interfaces;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on specific URLs
builder.WebHost.UseUrls("http://localhost:5001");

// Debug: Check connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"🔍 Connection String: {connectionString}");
Console.WriteLine($"🔍 Environment: {builder.Environment.EnvironmentName}");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        // Добавляем конвертер для enum в строки
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Add FluentValidation services using the new recommended way
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Add Infrastructure services (DbContext, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Add application services
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddHttpClient<IGitHubAuthService, GitHubAuthService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IMessageService, MessageService>();

// Add SignalR services
builder.Services.AddSignalR(options =>
{
    // Настройки для производительности
    options.EnableDetailedErrors = builder.Environment.IsDevelopment();
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.HandshakeTimeout = TimeSpan.FromSeconds(15);
});

// Add Connection Mapping service for SignalR
builder.Services.AddSingleton<IConnectionMapping, ConnectionMappingService>();

// Add Resend
builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = builder.Configuration["Resend:ApiKey"] ?? throw new InvalidOperationException("Resend API key not configured");
});
builder.Services.AddTransient<IResend, ResendClient>();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"] ?? "K7xcI2mlj8ELJsYwcvakXnNZclVHErx9E0A7HmTEOU4=")),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        // Add support for SignalR with JWT tokens
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                
                // If the request is for our hub...
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
                {
                    // Read the token out of the query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173", // Vite default port
                "http://localhost:5174", // Vite alternative port  
                "http://localhost:3000"  // Just in case
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Нужно для SignalR с JWT
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// app.UseHttpsRedirection(); // Отключаем для разработки
app.UseCors("AllowFrontend");

// Add static files support for uploads
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR Hub
app.MapHub<ChatHub>("/chatHub");

// Add startup logging
Console.WriteLine("🚀 Starting NebulaChat API server...");
Console.WriteLine($"🌐 Server will be available at: http://localhost:5001");
Console.WriteLine($"💬 SignalR Chat Hub available at: ws://localhost:5001/chatHub");
Console.WriteLine($"🔧 Environment: {app.Environment.EnvironmentName}");

app.Run();