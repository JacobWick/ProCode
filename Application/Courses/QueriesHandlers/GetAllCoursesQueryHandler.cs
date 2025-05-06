using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
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
        var courses = await _courseRepository.GetAllAsync(cancellationToken: cancellationToken);
        return courses.Select(c => new CourseDto
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            CreatedOn = c.CreatedOn,
            Lessons = c.Lessons.Select(l => l.Id).ToList()
        }).ToList();
    }
}