using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;

public class Test : IEntity
{
    [Key]
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public List<string> InputData { get; set; } = new List<string>();
    public List<string> OutputData { get; set; } = new List<string>();
}