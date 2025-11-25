using MediatR;

namespace Application.Users.Commands
{
    public class UpdateInterestsCommand : IRequest<bool>
    {
        public List<Guid> Tags { get; set; }
    }
}
