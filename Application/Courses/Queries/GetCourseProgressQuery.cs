using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries
{
    public class GetCourseProgressQuery: IRequest<CourseProgressDto?>
    {
         public Guid CourseId { get; set; }
    }
}
