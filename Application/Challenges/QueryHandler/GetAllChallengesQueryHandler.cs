using Application.Challenges.Query;
using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Challenges.QueryHandler
{
    public class GetAllChallengesQueryHandler : IRequestHandler<GetAllChallengesQuery, PaginatedResult<ChallengeDto>>
    {
        private readonly IChallengeRepository _challengeRepo;
        public GetAllChallengesQueryHandler(IChallengeRepository challengeRepo)
        {
            _challengeRepo = challengeRepo;
        }

        public async Task<PaginatedResult<ChallengeDto>> Handle(GetAllChallengesQuery request, CancellationToken cancellationToken)
        {
           var challenges = await _challengeRepo.GetPaginatedChallengesAsync(
               request.PageNumber, 
               request.PageSize, 
               cancellationToken);

            var totalCount = await _challengeRepo.GetTotalChallengesCountAsync(cancellationToken);

            return new PaginatedResult<ChallengeDto>()
           {
                Items = ChallengeMapper.MapListToDto(challenges),
                TotalCount = totalCount,
                Page = request.PageNumber,
                PageSize = request.PageSize
           };

        }
    }
}
