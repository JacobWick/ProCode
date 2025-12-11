using Application.Challenges.Query;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Challenges.QueryHandler
{
    public class GetActiveChallengesQueryHandler : IRequestHandler<GetActiveChallengesQuery, List<ChallengeDto>>
    {
        private readonly IRepository<Challenge> _challengeRepo;
        
        public GetActiveChallengesQueryHandler(IRepository<Challenge> challengeRepo)
        {
            _challengeRepo = challengeRepo;
        }

        public async Task<List<ChallengeDto>> Handle(GetActiveChallengesQuery request, CancellationToken cancellationToken)
        {
            var activeChallenges = await _challengeRepo.GetAsync(
                c => c.StartTime <= DateTime.UtcNow && c.EndTime >= DateTime.UtcNow,
                cancellationToken,
                includes: c => c.Exercises
               );

            activeChallenges = activeChallenges.OrderBy(c => c.EndTime).ToList();
            
            return ChallengeMapper.MapListToDto(activeChallenges);
        }
    }
}
