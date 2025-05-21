using Application.DTOs;
using Domain.Entities;

namespace Application.Mapper;

public static class ExerciseMapper
{
    public static ExerciseDto MapToDto(Exercise exercise)
    {
        return new ExerciseDto
        {
            Id = exercise.Id,
            Description = exercise.Description,
            InitialContent = exercise.InitialContent,
            LessonId = exercise.Lesson.Id
        };
    }
}