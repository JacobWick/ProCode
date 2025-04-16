using Application.Exercises.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Exercises.CommandHandlers
{
    public class UpdateExerciseCommandHandler: IRequestHandler<UpdateExerciseCommand, bool>
    {
        private readonly IRepository<Exercise> _exerciseRepository;

        public UpdateExerciseCommandHandler(IRepository<Exercise> exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<bool> Handle(UpdateExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);

            if (exercise == null) return false;

            if (request.Description is not null)
                exercise.Description = request.Description;

            if (request.InitialContent is not null)
                exercise.InitialContent = request.InitialContent;

            await _exerciseRepository.UpdateAsync(exercise, cancellation: cancellationToken);

            return true;
        }
    }
}
