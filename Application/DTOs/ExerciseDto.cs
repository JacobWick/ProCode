namespace Application.DTOs
{
    public class ExerciseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string InitialContent { get; set; } = string.Empty;
        public Guid? LessonId { get; set; }
    }
}
