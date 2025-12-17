using Application.Challenges.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Challenges.CommandHandlers
{
    public class CreateChallengeCommandHandler : IRequestHandler<CreateChallengeCommand, bool>
    {
        private readonly IRepository<Challenge> _challengeRepo;
        public CreateChallengeCommandHandler(IRepository<Challenge> challengeRepo)
        {
            _challengeRepo = challengeRepo;
        }

        public async Task<bool> Handle(CreateChallengeCommand request, CancellationToken cancellationToken)
        {

            var challenge = new Challenge
            {
                Title = request.Title,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                StartTime = request.StartTime,
                EndTime = request.EndTime
            };

            await _challengeRepo.CreateAsync(challenge, cancellationToken);

            return true;
        }
    }
}
