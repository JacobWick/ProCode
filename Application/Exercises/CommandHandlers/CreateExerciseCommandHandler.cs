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
        private readonly IRepository<Lesson> _lessonRepository;

        public CreateExerciseCommandHandler(IRepository<Exercise> exerciseRepository, IRepository<Lesson> lessonRepository)
        {
            _exerciseRepository = exerciseRepository;
            _lessonRepository = lessonRepository;
            
        }

        public async Task<ExerciseDto> Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
        {
            Lesson? lesson = null;
            
            if (request.LessonId != null)
            {
                lesson = await _lessonRepository.GetByIdAsync(request.LessonId);
            }

            var exercise = new Exercise
            {
                Description = request.Description,
                InitialContent = request.InitialContent,
                Lesson = lesson
            };

            await _exerciseRepository.CreateAsync(exercise);

            return new ExerciseDto
            {
                Id = exercise.Id,
                Description = exercise.Description,
                InitialContent = exercise.InitialContent,
                LessonId = exercise.Lesson?.Id
            };
        }

    }
}

