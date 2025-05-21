namespace Application.DTOs
{
    public class ExerciseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string InitialContent { get; set; }
        public Guid LessonId { get; set; }
    }
}
