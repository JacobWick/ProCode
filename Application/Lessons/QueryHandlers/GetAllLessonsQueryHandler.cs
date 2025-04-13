using Application.DTOs;
using Application.Lessons.Queries;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Lessons.QueryHandlers;

public class GetAllLessonsQueryHandler : IRequestHandler<GetAllLessonsQuery, List<LessonDto>>
{
    private readonly IRepository<Lesson> _lessonRepository;

    public GetAllLessonsQueryHandler(IRepository<Lesson> lessonRepository)
    {
        _lessonRepository = lessonRepository;
    }

    public async Task<List<LessonDto>> Handle(GetAllLessonsQuery request, CancellationToken cancellationToken)
    {
        var lessons = await _lessonRepository.GetAllAsync();
        return lessons.Select(lesson => new LessonDto
        {
            Id = lesson.Id,
            CreatedAt = lesson.CreatedAt,
            Title = lesson.Title,
            VideoUri = lesson.VideoUri,
            TextUri = lesson.TextUri,
            Exercises = lesson.Exercises
        }).ToList();
    }
}