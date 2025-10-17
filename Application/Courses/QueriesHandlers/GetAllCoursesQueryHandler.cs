using System.Linq.Expressions;
using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Courses.QueriesHandlers;

public class GetAllCoursesQueryHandler : IRequestHandler<GetAllCoursesQuery, List<CourseDto>>
{
    private readonly IRepository<Course> _courseRepository;

    public GetAllCoursesQueryHandler(IRepository<Course> courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<List<CourseDto>> Handle(GetAllCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = await _courseRepository.GetAllAsync(includes: new Expression<Func<Course, object>>[] {c => c.Lessons}, cancellationToken: cancellationToken);
        var coursesDtos = CourseMapper.MapListToDto(courses);
        
        return coursesDtos;
    }
}