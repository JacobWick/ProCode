namespace Domain.Entities;

public class SolutionExample
{
    public Guid Id { get; set; }
    
    public string Code { get; set; } = string.Empty;
    
    public string Explanation { get; set; } = string.Empty;
}