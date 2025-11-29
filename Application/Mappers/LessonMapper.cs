using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class LessonMapper
{
    public static LessonDto MapToDto(Lesson lesson)
    {
        return new LessonDto
        {
            Id = lesson.Id,
            Title = lesson.Title,
            Description = lesson.Description,
            VideoUri = lesson.VideoUri,
            TextUri = lesson.TextUri,
            Exercises = lesson.Exercises.Select(l => l.Id).ToList(),
            CreatedAt = lesson.CreatedAt,
        };
    }

    public static List<LessonDto> MapListToDto(ICollection<Lesson> lessons)
    {
        return lessons.Select(MapToDto).ToList();
    }
}