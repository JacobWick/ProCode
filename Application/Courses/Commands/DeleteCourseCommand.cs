using MediatR;

namespace Application.Courses.Commands;

public class DeleteCourseCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}