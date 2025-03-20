namespace Domain.Entities;

public class Exercise
{
    public Guid Id { get; set; }

    public SolutionExample? SolutionExample { get; set; }

    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;

    public ICollection<Tests> Tests = new List<Tests>();

    public ICollection<ValidationMethod> ValidationMethods { get; set; } = new List<ValidationMethod>();

    public string Description { get; set; } = string.Empty;
    public string InitialContent { get; set; } = string.Empty;
    
}