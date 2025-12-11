using Application.DTOs;
using MediatR;

namespace Application.Lessons.Commands;

public class CreateLessonCommand : IRequest<LessonDto>
{
    public ICollection<Guid> ExerciseIds { get; set; } = new List<Guid>();
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? VideoUri { get; set; }
    public string? TextUri { get; set; }
}