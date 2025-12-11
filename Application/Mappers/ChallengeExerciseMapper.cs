using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers
{
    public static class ChallengeExerciseMapper
    {
        public static ChallengeExerciseDto MapToDto(Exercise exercise)
        {
            return new ChallengeExerciseDto
            {
                Id = exercise.Id,
                Description = exercise.Description,
                InitialContent = exercise.InitialContent,
            };
        }

        public static List<ChallengeExerciseDto> MapListToDto(ICollection<Exercise> exercises)
        {
            return exercises.Select(MapToDto).ToList();
        }
    }
}
