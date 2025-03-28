using Domain.Interfaces;

namespace Domain.Entities;

public class Exercise : IEntity
{
    public Guid Id { get; set; }

    public SolutionExample? SolutionExample { get; set; }
    
    public Lesson Lesson { get; set; } = null!;

    public ICollection<Test> Tests = new List<Test>();

    public ICollection<ValidationMethod> ValidationMethods { get; set; } = new List<ValidationMethod>();

    public string Description { get; set; } = string.Empty;
    public string InitialContent { get; set; } = string.Empty;
    
}