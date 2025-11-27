using System.Linq.Expressions;
using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Courses.QueriesHandlers;

public class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, CourseDto>
{
    private readonly IRepository<Course> _courseRepository;

    public GetCourseByIdQueryHandler(IRepository<Course> courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<CourseDto> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        var course = await _courseRepository.GetByIdAsync(request.Id, includes:new Expression<Func<Course, object>>[] {c => c.Lessons, c => c.Creator} ,cancellationToken:cancellationToken);
        if (course == null)
        {
            return null;
        }
        var courseDto = CourseMapper.MapToDto(course);
        return courseDto;
    }
}