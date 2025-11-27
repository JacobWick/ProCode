using Application.Common.Models;
using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using MediatR;

namespace Application.Courses.QueriesHandlers;

public class GetPaginatedCoursesQueryHandler : IRequestHandler<GetPaginatedCoursesQuery, PaginatedResult<CourseDto>>
{
    private readonly ICourseRepository _courseRepository;

    public GetPaginatedCoursesQueryHandler(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<PaginatedResult<CourseDto>> Handle(GetPaginatedCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = await _courseRepository.GetPaginatedCoursesWithLessons(request.PageNumber, request.PageSize, cancellationToken);
        var coursesDtos = CourseMapper.MapListToDto(courses);

        var totalCount = await _courseRepository.GetTotalCoursesCount(cancellationToken);

        return new PaginatedResult<CourseDto>
        {
            Items = coursesDtos,
            TotalCount = totalCount,
            Page = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}