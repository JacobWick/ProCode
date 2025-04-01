using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;

public class Test : IEntity
{
    [Key]
    public Guid Id { get; set; }
    
    public Exercise Exercise { get; set; } = null!;

    public List<string> InputData { get; set; }
    public List<string> OutputData { get; set; }
}