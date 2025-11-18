using Application.Interfaces;
using Application.Users.Commands;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.CommandHandlers;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, bool>
{
    private readonly IRepository<User>  _userRepository;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public UpdateUserCommandHandler(IRepository<User> userRepository, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);
        if (user == null)
        {
            return false;
        }

        if (request.Email is not null)
        {
            user.Email = request.Email;
        }
        if (request.UserName is not null)
        {
            user.UserName = request.UserName;
        }
        if (request.FirstName is not null)
        {
            user.FirstName = request.FirstName;
        }
        if (request.LastName is not null)
        {
            user.LastName = request.LastName;
        }
        await _userRepository.UpdateAsync(user, cancellationToken);
        if (request.Role is not null)
        {
            if (!await _roleManager.RoleExistsAsync(request.Role))
                return false;
           var userRoles = await _userManager.GetRolesAsync(user);
           foreach (var role in userRoles)
           {
               var remove = await _userManager.RemoveFromRoleAsync(user, role);
               if (!remove.Succeeded)
                   return false;
           }
           var newRole = await _userManager.AddToRoleAsync(user, request.Role);
           if (!newRole.Succeeded)
               return false;
        }
        return true;
    }
}