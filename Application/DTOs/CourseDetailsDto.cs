using Domain.Enums;

namespace Application.DTOs
{
    public class CourseDetailsDto
    {
        public Guid Id { get; set; }
        public TimeOnly EstimatedDuration { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public List<LessonOverview> Lessons { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
    }

    public class LessonOverview
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public LessonOverview(Guid Id, string Title, string Description)
        {
            this.Id = Id;
            this.Title = Title;
            this.Description = Description;
        }
    }
}
