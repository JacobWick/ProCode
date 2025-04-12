using MediatR;

namespace Application.Lessons.Commands;

public class DeleteLessonCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}