using Application.DTOs;
using MediatR;

namespace Application.Users.Commands;

public class CreateUserCommand : IRequest<UserDto>
{
    public string Email { get; set; }
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}