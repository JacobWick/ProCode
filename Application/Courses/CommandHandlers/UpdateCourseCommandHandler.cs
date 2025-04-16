using Application.Courses.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.CommandHandlers;

public class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand, bool>
{
    private readonly IRepository<Course> _courseRepository;
    private readonly IRepository<Lesson> _lessonRepository;

    public UpdateCourseCommandHandler(IRepository<Course> courseRepository, IRepository<Lesson> lessonRepository)
    {
        _courseRepository = courseRepository;
        _lessonRepository = lessonRepository;
    }

    public async Task<bool> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        var course = await _courseRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);
        if (course == null)
            return false;
        if (request.Title is not null)
            course.Title = request.Title;
        if (request.Description is not null)
            course.Description = request.Description;
        if (request.DifficultyLevel != course.DifficultyLevel)
            course.DifficultyLevel = request.DifficultyLevel;
        if (request.Rating != course.Rating)
            course.Rating = request.Rating;
        if (request.Lessons.Count > 0)
        {
            foreach (var lessonId in request.Lessons)
            {
                if (course.Lessons.Any(l => l.Id == lessonId))
                    continue;
                var lesson = await _lessonRepository.GetByIdAsync(lessonId, cancellationToken: cancellationToken);
                if (lesson is not null)
                {
                    course.Lessons.Add(lesson);
                }
            }
        }

        return _courseRepository.UpdateAsync(course).IsCompletedSuccessfully;

    }
}