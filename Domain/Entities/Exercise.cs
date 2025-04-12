using System.ComponentModel.DataAnnotations;
using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

public class Exercise : IEntity
{
    [Key]
    public Guid Id { get; set; }

    public SolutionExample? SolutionExample { get; set; }
    
    public Lesson Lesson { get; set; } = null!;

    public ICollection<Test> Tests = new List<Test>();

    public ValidationMethod ValidationMethod { get; set; }

    public string Description { get; set; } = string.Empty;
    public string InitialContent { get; set; } = string.Empty;
    
}