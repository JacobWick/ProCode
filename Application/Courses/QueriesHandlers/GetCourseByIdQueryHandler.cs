using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
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
        var course = await _courseRepository.GetByIdAsync(request.Id);
        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            CreatedOn = course.CreatedOn,
            DifficultyLevel = course.DifficultyLevel,
            Rating = course.Rating,
            Lessons = course.Lessons.Select(l => l.Id).ToList(),
        };
    }
}