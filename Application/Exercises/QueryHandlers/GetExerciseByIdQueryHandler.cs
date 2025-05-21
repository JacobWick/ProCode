using Application.DTOs;
using Application.Exercises.Queries;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Exercises.QueryHandlers
{
    public class GetExerciseByIdQueryHandler : IRequestHandler<GetExerciseByIdQuery, ExerciseDto>
    {
        private readonly IRepository<Exercise> _exerciseRepository;

        public GetExerciseByIdQueryHandler(IRepository<Exercise> exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<ExerciseDto> Handle(GetExerciseByIdQuery request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);

            if (exercise == null)
                return null!;

            return new ExerciseDto
            {
                Id = request.Id,
                Description = exercise.Description,
                InitialContent = exercise.InitialContent,
                LessonId = exercise.Lesson.Id
            };
        }
    }
}
