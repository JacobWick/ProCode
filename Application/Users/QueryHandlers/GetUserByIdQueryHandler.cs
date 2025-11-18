using Application.DTOs;
using Application.Interfaces;
using Application.Users.Queries;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.QueryHandlers;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>
{
    private readonly IRepository<User> _userRepository;
    private readonly UserManager<User> _userManager;

    public GetUserByIdQueryHandler(IRepository<User> userRepository, UserManager<User> userManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
    }

    public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken:cancellationToken);
        var role = await _userManager.GetRolesAsync(user);
        return new UserDto
         {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.UserName,
            Email = user.Email,
            Role = role.FirstOrDefault()
        };
    }
}