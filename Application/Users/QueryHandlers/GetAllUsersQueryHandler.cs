using Application.DTOs;
using Application.Users.Queries;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Users.QueryHandlers;

public class GetAllUsersQueryHandler: IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IRepository<User> _userRepository;

    public GetAllUsersQueryHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(user => new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.UserName,
        }).ToList();
    }
}