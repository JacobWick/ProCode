using Application.DTOs;
using MediatR;

namespace Application.Challenges.Query
{
    public class GetActiveChallengesQuery : IRequest<List<ChallengeDto>>
    {

    }
}
