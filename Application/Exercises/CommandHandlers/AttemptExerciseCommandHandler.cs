using Application.Common.Exceptions;
using Application.Exercises.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Exercises.CommandHandlers
{
    public class AttemptExerciseCommandHandler : IRequestHandler<AttemptExerciseCommand, AttemptExerciseResponse>
    {
        private readonly IRepository<Exercise> _exerciseRepo;
        private readonly IExerciseService _exerciseService;

        public AttemptExerciseCommandHandler(IRepository<Exercise> exerciseRepo, IExerciseService exerciseService)
        {
            _exerciseRepo = exerciseRepo;
            _exerciseService = exerciseService;
        }

        public async Task<AttemptExerciseResponse> Handle(AttemptExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepo.GetByIdAsync(request.ExerciseId, includes: e => e.Tests, cancellationToken: cancellationToken);

            if (exercise is null)
            {
                throw new NotFoundException("Exercise not found", nameof(Exercise));
            }

            var success = await _exerciseService.AttemptExercise(request.CodeSubmission, exercise, cancellationToken);

            return new AttemptExerciseResponse
            {
                IsSuccessful = success
            };
        }
    }
}
