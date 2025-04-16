using Application.DTOs;
using Application.Interfaces;
using Application.Lessons.Queries;
using Domain.Entities;
using MediatR;

namespace Application.Lessons.QueryHandlers;

public class GetLessonByIdQueryHandler : IRequestHandler<GetLessonByIdQuery, LessonDto>
{
    private readonly IRepository<Lesson> _lessonRepository;

    public GetLessonByIdQueryHandler(IRepository<Lesson> lessonRepository)
    {
        _lessonRepository = lessonRepository;
    }

    public async Task<LessonDto> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
    {
        var lesson = await _lessonRepository.GetByIdAsync(request.Id);
        return new LessonDto
        {
            Id = lesson.Id,
            Title = lesson.Title,
            VideoUri = lesson.VideoUri,
            TextUri = lesson.TextUri,
            Exercises = lesson.Exercises.Select(e => e.Id).ToList()
        };
    }
}