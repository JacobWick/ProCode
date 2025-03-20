namespace Domain.Entities;

public class Tests
{
    public Guid Id { get; set; }
    
    public Exercise Exercise { get; set; } = null!;

    public List<string> InputData { get; set; }
    public List<string> OutputData { get; set; }
}