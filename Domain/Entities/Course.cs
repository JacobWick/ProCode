using Domain.Enums;

namespace Domain.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public User? Creator { get; set; }
    public DateTime CreatedAt { get; set; }
    public DifficultyLevel DifficultyLevel { get; set; }
    public int Rating { get; set; }
    public List<Lesson>? Lessons { get; init; } = [];

}