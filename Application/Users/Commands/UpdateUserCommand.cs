using MediatR;

namespace Application.Users.Commands;

public class UpdateUserCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Role { get; set; }
}