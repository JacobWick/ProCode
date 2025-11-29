using Domain.Entities;
using MediatR;

namespace Application.Lessons.Commands;

public class UpdateLessonCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public List<Guid> Exercises { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
}