namespace Application.DTOs;

public class TestDto
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public List<string> InputData { get; set; }
    public List<string> OutputData { get; set; }
}