using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class ValidationMethod
{
    public Guid Id { get; set; }
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    [Required]
    public string? ValidationType { get; set; }
    [Required]
    public string? Description { get; set; }
}