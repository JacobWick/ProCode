using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;

public class ValidationMethod : IEntity
{
    [Key]
    public Guid Id { get; set; }
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    [Required]
    public string? ValidationType { get; set; }
    [Required]
    public string? Description { get; set; }
}