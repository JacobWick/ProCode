using Domain.Entities;
using Domain.Enums;

namespace Application.DTOs
{
    public class ChallengeDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public ICollection<ChallengeExerciseDto> Exercises { get; set; }
    }
}
