namespace Domain.Entities;

public class Exercise
{
    public Guid Id { get; set; }
    public string Description { get; set; }
    public string InitialContent  {get; set;}
    public ValidationMethod ValidationMethod { get; set; }
    public SolutionExample SolutionExample { get; set; }
}