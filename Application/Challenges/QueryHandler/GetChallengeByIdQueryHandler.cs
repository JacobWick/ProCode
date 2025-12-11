using Application.Challenges.Query;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;
using System.Linq.Expressions;

namespace Application.Challenges.QueryHandler
{
    public class GetChallengeByIdQueryHandler : IRequestHandler<GetChallengeByIdQuery, ChallengeDto>
    {
        private readonly IRepository<Challenge> _challengeRepo;
        public GetChallengeByIdQueryHandler(IRepository<Challenge> challengeRepo)
        {
            _challengeRepo = challengeRepo;
        }
        public async Task<ChallengeDto> Handle(GetChallengeByIdQuery request, CancellationToken cancellationToken)
        {
            var challenge = await _challengeRepo.GetByIdAsync(
                request.Id,
                cancellationToken: cancellationToken,
                includes: new Expression<Func<Challenge, object>>[] { l => l.Exercises });

            if (challenge == null)
            {
                throw new KeyNotFoundException($"Challenge with ID {request.Id} not found.");
            }

            return ChallengeMapper.MapToDto(challenge);
        }
    }
}
