using Domain.Enums;

namespace Application.DTOs
{
    public class CourseOverviewDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public BriefAuthorUserDto CreatedBy { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public int Rating { get; set; }
    }
}
