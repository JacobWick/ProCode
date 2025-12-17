using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers
{
    public static class ChallengeMapper
    {
        public static ChallengeDto MapToDto(Challenge challenge)
        {
            return new ChallengeDto
            {
                Id = challenge.Id,
                Description = challenge.Description,
                CreatedAt = challenge.CreatedAt,
                EndTime = challenge.EndTime,
                Exercises = ChallengeExerciseMapper.MapListToDto(challenge.Exercises),
                StartTime = challenge.StartTime,
                Title = challenge.Title
            };
        }

        public static List<ChallengeDto> MapListToDto(ICollection<Challenge> challenges)
        {
            return challenges.Select(MapToDto).ToList();
        }
    }
}
