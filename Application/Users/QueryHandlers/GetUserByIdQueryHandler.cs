using Application.DTOs;
using Application.Interfaces;
using Application.Users.Queries;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Users.QueryHandlers;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, User>
{
    private readonly IRepository<User> _userRepository;

    public GetUserByIdQueryHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken:cancellationToken);
        if (user == null)
        {
            return null;
        }

        return user;
    }
}