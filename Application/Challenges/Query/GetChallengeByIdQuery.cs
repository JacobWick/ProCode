using Application.DTOs;
using MediatR;

namespace Application.Challenges.Query
{
    public class GetChallengeByIdQuery : IRequest<ChallengeDto>
    {
        public Guid Id { get; set; }
    }
}
