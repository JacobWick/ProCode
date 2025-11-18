using MediatR;

namespace Application.Courses.Commands
{
    public class EnrollInCourseCommand : IRequest<bool>
    {
        public Guid CourseId { get; set; }
    }
}
