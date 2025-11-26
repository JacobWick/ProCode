using Domain.Enums;
using MediatR;

namespace Application.Challenges.Commands
{
    public class UpdateChallengeCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public ICollection<DifficultyLevel> AllowedLevels { get; set; }
    }
}
