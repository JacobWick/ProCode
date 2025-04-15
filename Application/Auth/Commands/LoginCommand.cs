using MediatR;

namespace Application.Auth.Commands
{
    public class LoginCommand : IRequest<string>
    {
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
