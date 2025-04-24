using Application.DTOs;
using MediatR;

namespace Application.Lessons.Commands;

public class CreateLessonCommand : IRequest<LessonDto>
{
    public ICollection<Guid> ExerciseIds { get; set; } = new List<Guid>();
    public string Title { get; set; } = string.Empty;
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
}