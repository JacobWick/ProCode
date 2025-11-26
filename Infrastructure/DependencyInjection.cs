using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserContextService, UserContextService>();
        services.AddHttpContextAccessor();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddDbContext<PostgresDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        services
            .AddIdentityCore<User>()
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<PostgresDbContext>();

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<PostgresDbContext>());
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IChallengeRepository, ChallengeRepository>();
        return services;
    }
}