using Application.Auth.Commands;
using Application.Interfaces;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Auth.CommandHandlers
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, bool>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository<UserProfile> _profileRepo;

        public RegisterCommandHandler(UserManager<User> userManager, IRepository<UserProfile> profileRepo)
        {
            _userManager = userManager;
            _profileRepo = profileRepo;
        }

        public async Task<bool> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new DuplicatedEmailException(request.Email);
            }
            var user = new User
            {
                UserName = request.UserName,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            await _userManager.AddToRoleAsync(user, Roles.Student);

            var profile = new UserProfile { 
                UserId = user.Id 
            };

            await _profileRepo.CreateAsync(profile, cancellationToken);

            return result.Succeeded;
        }
    }
}
