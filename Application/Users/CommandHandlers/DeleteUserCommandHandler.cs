using Application.Interfaces;
using Application.Users.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Users.CommandHandlers;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IRepository<User> _userRepository;

    public DeleteUserCommandHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);
        if (user == null)
            return false;
        await _userRepository.DeleteAsync(user);
        return true;
    }
}