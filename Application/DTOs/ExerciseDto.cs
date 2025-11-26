namespace Application.DTOs
{
    public class ExerciseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string InitialContent { get; set; }
        public List<string> InputData { get; set; }
        public List<string> OutputData { get; set; }
        public Guid LessonId { get; set; }
        public Guid SolutionExampleId { get; set; }
    }
}
