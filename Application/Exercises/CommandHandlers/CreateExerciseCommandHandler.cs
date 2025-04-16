using Application.DTOs;
using Application.Exercises.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Exercises.CommandHandlers
{
    public class CreateExerciseCommandHandler : IRequestHandler<CreateExerciseCommand, ExerciseDto>
    {
        private readonly IRepository<Exercise> _exerciseRepository;

        public CreateExerciseCommandHandler(IRepository<Exercise> exerciseRepository) {
            _exerciseRepository = exerciseRepository;
        }

        async Task<ExerciseDto> IRequestHandler<CreateExerciseCommand, ExerciseDto>.Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = new Exercise
            {
                Description = request.Description,
                InitialContent = request.InitialContent,
                Lesson = new Lesson { Id = request.LessonId }
            };

            await _exerciseRepository.CreateAsync(exercise);

            return new ExerciseDto
            {
                Id = exercise.Id,
                Description = exercise.Description,
                InitialContent = exercise.InitialContent,
                LessonId = exercise.Lesson.Id
            };
        }
    }
}
