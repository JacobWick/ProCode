using Application.DTOs;
using MediatR;

namespace Application.Lessons.Commands;

public class CreateLessonCommand : IRequest<LessonDto>
{
    public List<Guid> ExerciseIds { get; set; }
    public string Title { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
}