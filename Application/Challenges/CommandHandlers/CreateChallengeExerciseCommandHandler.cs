using Application.Challenges.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Challenges.CommandHandlers
{
    public class CreateChallengeExerciseCommandHandler : IRequestHandler<CreateChallengeExerciseCommand, Guid>
    {
        private readonly IRepository<Exercise> _exerciseRepo;

        public CreateChallengeExerciseCommandHandler(IRepository<Exercise> exerciseRepo)
        {
             _exerciseRepo = exerciseRepo;
        }

        public async Task<Guid> Handle(CreateChallengeExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = new Exercise
            {
                ChallengeId = request.ChallengeId,
                Description = request.Description,
                InitialContent = request.InitialContent
            };

            await _exerciseRepo.CreateAsync(exercise, cancellationToken);

            return exercise.Id;
        }
    }
}
