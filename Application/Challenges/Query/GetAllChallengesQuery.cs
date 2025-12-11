using Application.Common.Models;
using Application.DTOs;
using MediatR;

namespace Application.Challenges.Query
{
    public class GetAllChallengesQuery : IRequest<PaginatedResult<ChallengeDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
