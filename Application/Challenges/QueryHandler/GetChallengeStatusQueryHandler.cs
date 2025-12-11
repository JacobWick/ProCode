using Application.Challenges.Query;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Challenges.QueryHandler
{
    public class GetChallengeStatusQueryHandler : IRequestHandler<GetChallengeStatusQuery, GetChallengeStatusResponse>
    {
        private readonly IUserContextService _userContextService;
        private readonly IRepository<User> _userRepo;

        public GetChallengeStatusQueryHandler(
            IUserContextService userContextService,
            IRepository<User> userRepo)
        {
            _userContextService = userContextService;
            _userRepo = userRepo;
        }

        public async Task<GetChallengeStatusResponse> Handle(GetChallengeStatusQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId;

            if (userId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            var user = await _userRepo.GetByIdAsync(
                userId,
                includes: u => u.CompletedChallenges,
                cancellationToken: cancellationToken);

            if (user == null) 
            {
                throw new KeyNotFoundException("User not found.");
            }

            var isCompleted = user.CompletedChallenges.Any(c => c.Id == request.Id);

            return new GetChallengeStatusResponse
            {
                Id = request.Id,
                IsCompleted = isCompleted,
            };
        }
    }
}
