using Application.Challenges.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Challenges.CommandHandlers
{
    public class SetChallengeStatusCommandHandler : IRequestHandler<SetChallengeStatusCommand, bool>
    {
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Challenge> _challengeRepo;
        private readonly IUserContextService _userContextService;

        public SetChallengeStatusCommandHandler(
            IRepository<User> userRepo, 
            IRepository<Challenge> challengeRepo,
            IUserContextService userContextService)
        {
            _userRepo = userRepo;
            _challengeRepo = challengeRepo;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(SetChallengeStatusCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId;

            if (userId == Guid.Empty)
            {
                throw new Exception("You have to be logged in");
            }

            var user = await _userRepo.GetByIdAsync(
                userId,
                includes: u => u.CompletedChallenges,
                cancellationToken: cancellationToken);

            if (user is null)
            {
                throw new Exception("User not found");
            }

            var challenge = await _challengeRepo.GetByIdAsync(
                request.Id,
                cancellationToken: cancellationToken);

            if (challenge is null)
            {
                throw new Exception("Challenge not found");
            }

            if (request.IsCompleted) {
                if (user.CompletedChallenges.Any(c => c.Id == challenge.Id))
                {
                    return true;
                }

                user.CompletedChallenges.Add(challenge);
            }

            else {
                var completedChallenge = user.CompletedChallenges.FirstOrDefault(c => c.Id == challenge.Id);
                if (completedChallenge is null)
                {
                    return true;
                }
                user.CompletedChallenges.Remove(completedChallenge);
            }

            return true;
        }
    }
}
