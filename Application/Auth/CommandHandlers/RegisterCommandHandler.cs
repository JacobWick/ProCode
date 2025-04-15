using Application.Auth.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Auth.CommandHandlers
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, bool>
    {
        private readonly UserManager<User> _userManager;

        public RegisterCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                UserName = request.UserName,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            return result.Succeeded;
        }
    }
}
