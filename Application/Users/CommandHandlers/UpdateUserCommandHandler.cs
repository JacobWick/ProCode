using Application.Users.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Users.CommandHandlers;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, bool>
{
    private readonly IRepository<User>  _userRepository;

    public UpdateUserCommandHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);
        if (user == null)
        {
            return false;
        }

        if (request.Email is not null)
        {
            user.Email = request.Email;
        }
        if (request.Username is not null)
        {
            user.UserName = request.Username;
        }
        if (request.FirstName is not null)
        {
            user.FirstName = request.FirstName;
        }
        if (request.LastName is not null)
        {
            user.LastName = request.LastName;
        }
        return _userRepository.UpdateAsync(user, cancellationToken).IsCompletedSuccessfully;
    }
}