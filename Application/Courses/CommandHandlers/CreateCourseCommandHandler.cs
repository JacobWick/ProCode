using Application.Courses.Commands;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.CommandHandlers;

public class CreateCourseCommandHandler : IRequestHandler<CreateCourseCommand, CourseDto>
{
    private readonly IRepository<Course> _courseRepository;
    private readonly IRepository<Lesson> _lessonRepository;
    private readonly IRepository<User> _userRepository;

    public CreateCourseCommandHandler(IRepository<Course> courseRepository, IRepository<Lesson> lessonRepository, IRepository<User> userRepository)
    {
        _courseRepository = courseRepository;
        _lessonRepository = lessonRepository;
        _userRepository = userRepository;
    }

    public async Task<CourseDto> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        var lessons = await _lessonRepository.GetAsync(l => request.Lessons.Contains(l.Id), cancellationToken);
        var user = await _userRepository.GetByIdAsync(request.CreatedBy, cancellationToken: cancellationToken);
        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            User = user,
            DifficultyLevel = request.DifficultyLevel,
            CreatedOn = DateTime.Now,
            Rating = 0,
            Lessons = lessons,
        };
        await _courseRepository.CreateAsync(course, cancellationToken);
        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            DifficultyLevel = course.DifficultyLevel,
            Rating = course.Rating,
            CreatedOn = course.CreatedOn,
            CreatedBy = course.User.Id,
            Lessons = course.Lessons.Select(l => l.Id).ToList()
        };
    }
}