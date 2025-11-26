namespace Application.DTOs
{
    public class CourseProgressDto
    {
        public Guid CourseId { get; set; }
        public string Title { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public List<Guid> CompletedLessonsIds { get; set; }
        public double Percentage => TotalLessons == 0 ? 0 : (double)CompletedLessons / TotalLessons * 100;
    }
}

