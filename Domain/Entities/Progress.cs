using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;

public class Progress : IEntity
{
    [Key]
    public Guid Id { get; set; }
    
    public User User { get; set; } = null!;
    
    public Course Course { get; set; } = null!;

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public DateOnly LastAccessedAt { get; set; }
}