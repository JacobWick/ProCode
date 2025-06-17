using Application.DTOs;
using Application.Interfaces;
using Application.Lessons.Queries;
using Application.Mappers;
using Domain.Entities;
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
        var lessonDtos = LessonMapper.MapListToDto(lessons);
        
        return lessonDtos;
    }
}