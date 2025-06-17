using Application.DTOs;
using Application.Interfaces;
using Application.Lessons.Queries;
using Application.Mappers;
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
        if (lesson == null)
            return null;
        return LessonMapper.MapToDto(lesson);
    }
}