using Domain.Constants;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Seeders
{
    public class UserSeeder
    {
        public static async Task SeedAsync(UserManager<User> userManager)
        {
            const string adminFirstName = "AdminFirstName";
            const string adminLastName = "AdminLastName";
            const string adminEmail = "admin@procode.com";
            const string adminUsername = "admin";
            const string adminPassword = "Admin123!";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser is not null)
                return;

            var newAdmin = new User
            {
                FirstName = adminFirstName,
                LastName = adminLastName,
                Email = adminEmail,
                UserName = adminUsername,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(newAdmin, adminPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Admin creation failed: {errors}");
            }

            var createdUser = await userManager.FindByEmailAsync(adminEmail);

            if (createdUser == null)
                return;

            var roleResult = await userManager.AddToRoleAsync(createdUser, Roles.Admin);

            if (!roleResult.Succeeded)
            {
                var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                throw new Exception($"Admin role assignment failed: {errors}");
            }
        }
    }
}
