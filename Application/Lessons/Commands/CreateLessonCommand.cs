using Domain.Entities;
using MediatR;

namespace Application.Lessons.Commands;

public class CreateLessonCommand : IRequest<bool>
{
    public List<Guid> Exercises { get; set; }
    public string Title { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
}