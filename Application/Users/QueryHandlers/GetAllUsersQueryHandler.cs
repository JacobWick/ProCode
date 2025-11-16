using Application.DTOs;
using Application.Interfaces;
using Application.Users.Queries;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.QueryHandlers;

public class GetAllUsersQueryHandler: IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IRepository<User> _userRepository;
    private readonly UserManager<User> _userManager;

    public GetAllUsersQueryHandler(IRepository<User> userRepository, UserManager<User> userManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync();
        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var role = await _userManager.GetRolesAsync(user);
            userDtos.Add(new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.UserName,
                Email = user.Email,
                Role = role.FirstOrDefault()
            });
        }
        return userDtos;
    }
}