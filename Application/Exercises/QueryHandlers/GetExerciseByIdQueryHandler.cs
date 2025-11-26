using System.Linq.Expressions;
using Application.DTOs;
using Application.Exercises.Queries;
using Application.Interfaces;
using Application.Mappers;
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
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id, includes: new Expression<Func<Exercise, object>>[] {e => e.Lesson, e => e.Test, e => e.SolutionExample}, cancellationToken: cancellationToken);

            if (exercise == null)
                return null!;

            return ExerciseMapper.MapToDto(exercise);
        }
    }
}
