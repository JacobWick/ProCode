using Domain.Enums;

namespace Application.UserProfiles.Queries
{
    public class CourseOverviewDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DifficultyLevel DifficultyLevel { get; set; }
        public int Rating { get; set; }
    }
}
