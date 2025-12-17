namespace Application.DTOs
{
    public class ChallengeExerciseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string InitialContent { get; set; }
        public List<string> InputData { get; set; }
        public List<string> OutputData { get; set; }
    }
}
