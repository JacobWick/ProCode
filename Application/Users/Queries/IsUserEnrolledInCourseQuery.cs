using MediatR;

namespace Application.Users.Queries
{
    public class IsUserEnrolledInCourseQuery : IRequest<IsUserEnrolledInCourseResponse>
    {
        public Guid CourseId { get; set; }
    }
}
