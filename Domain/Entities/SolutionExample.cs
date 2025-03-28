using Domain.Interfaces;

namespace Domain.Entities;

public class SolutionExample : IEntity
{
    public Guid Id { get; set; }
    
    public string Code { get; set; } = string.Empty;
    
    public string Explanation { get; set; } = string.Empty;
}