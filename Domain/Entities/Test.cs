using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Domain.Interfaces;

namespace Domain.Entities;

public class Test : IEntity
{
    [Key]
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!; 

    public JsonDocument InputData { get; set; }
    public JsonDocument OutputData { get; set; }
}