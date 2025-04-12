using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;

public class Lesson  : IEntity
{
    [Key]
    public Guid Id { get; set; }
    
    public Progress? Progress { get; set; }
    
    public Course Course { get; set; } = null!;

    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();

    public string? Title { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
    public DateTime CreatedAt { get; set; }
}