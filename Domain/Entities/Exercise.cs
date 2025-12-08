using System.ComponentModel.DataAnnotations;
using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

public class Exercise : IEntity
{
    [Key]
    public Guid Id { get; set; }

    public SolutionExample? SolutionExample { get; set; }
    
    public Lesson? Lesson { get; set; }

    public ICollection<Test> Tests { get; set; } = new List<Test>();

    public ValidationMethod ValidationMethod { get; set; }

    public string Description { get; set; } = string.Empty;
    public string InitialContent { get; set; } = string.Empty;

    public Guid? ChallengeId { get; set; }
    public Challenge? Challenge { get; set; }
}