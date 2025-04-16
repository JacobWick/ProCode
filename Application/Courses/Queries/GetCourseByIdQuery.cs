using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries;

public class GetCourseByIdQuery : IRequest<CourseDto>
{
    public Guid Id { get; set; }
}