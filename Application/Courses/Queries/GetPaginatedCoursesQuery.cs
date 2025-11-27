using Application.Common.Models;
using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries;

public class GetPaginatedCoursesQuery : IRequest<PaginatedResult<CourseDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
