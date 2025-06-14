using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Debug: Check connection string in Infrastructure
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        Console.WriteLine($"🔍 Infrastructure Connection String: {connectionString}");
        
        // Add DbContext
        services.AddDbContext<NebulaChatDbContext>(options =>
            options.UseNpgsql(connectionString, 
                b => b.MigrationsAssembly("NebulaChat.Infrastructure")));

        return services;
    }
} 