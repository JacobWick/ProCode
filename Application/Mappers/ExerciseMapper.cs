using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class ExerciseMapper
{
    public static ExerciseDto MapToDto(Exercise exercise)
    {
        return new ExerciseDto
        {
            Id = exercise.Id,
            Description = exercise.Description,
            InitialContent = exercise.InitialContent,
            LessonId = exercise.Lesson?.Id ?? Guid.Empty
        };
    }

    public static List<ExerciseDto> MapListToDto(ICollection<Exercise> exercises)
    {
        return exercises.Select(MapToDto).ToList();
    }
}