using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries
{
    public class GetCourseDetailsQuery : IRequest<CourseDetailsDto>
    {
        public Guid CourseId { get; set; }
    }
}
