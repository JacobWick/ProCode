using Application.DTOs;
using Application.Exercises.Queries;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Exercises.QueryHandlers
{
    public class GetAllExercisesQueryHandler : IRequestHandler<GetAllExercisesQuery, List<ExerciseDto>>
    {
        private readonly IRepository<Exercise> _exerciseRepository;

        public GetAllExercisesQueryHandler(IRepository<Exercise> exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<List<ExerciseDto>> Handle(GetAllExercisesQuery request, CancellationToken cancellationToken)
        {
            var exercises = await _exerciseRepository.GetAllAsync();
            var exerciseDtos = ExerciseMapper.MapListToDto(exercises);
            
            return exerciseDtos;
        }
    }
}
