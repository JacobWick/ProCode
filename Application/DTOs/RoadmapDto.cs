namespace Application.DTOs
{
    public class RoadmapDto
    {
        public Guid UserId { get; set; }
        public List<CourseDto> RecommendedCourses { get; set; } = new();
    }
}
