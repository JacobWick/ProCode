using Domain.Enums;

namespace Application.DTOs;

public class CourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedOn { get; set; }
    public Guid CreatedBy { get; set; }
    public List<Guid> Lessons { get; set; }
    public DifficultyLevel DifficultyLevel { get; set; }
    public int Rating { get; set; }
    
}