using Domain.Entities;

namespace Application.DTOs;

public class LessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
    public ICollection<Exercise> Exercises { get; set; }
    public DateTime CreatedAt { get; set; }
}