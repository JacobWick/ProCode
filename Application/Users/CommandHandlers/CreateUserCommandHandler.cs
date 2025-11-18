using Application.Users.Commands;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.CommandHandlers;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CreateUserResult>
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public CreateUserCommandHandler(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }
    public async Task<CreateUserResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User { UserName = request.UserName, Email = request.Email, FirstName = request.FirstName, LastName = request.LastName };
        var result = await _userManager.CreateAsync(user, request.Password);
        
        if (!result.Succeeded)
        {
            if(result.Errors.Any(e => e.Code == "DuplicateUserName"))
                return new CreateUserResult {Success = false, Error = "Username already exists" };
         
            if(result.Errors.Any(e => e.Code == "DuplicateEmail"))
                return new CreateUserResult {Success = false, Error = "Email already exists"};
            
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return new CreateUserResult {Success = false, Error = errors};
        }

        if (!string.IsNullOrEmpty(request.Role))
        {
            var roleExists = await _roleManager.RoleExistsAsync(request.Role);
            if (!roleExists)
            {
                return  new CreateUserResult {Success = false, Error = "Role not found"};
            }
            var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                var roleErrors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                return new CreateUserResult { Success = false, Error = roleErrors };
            }
        }
        else
        {
            await _userManager.AddToRoleAsync(user, "Student");
        }
        return new CreateUserResult {Success = true};
    }
}