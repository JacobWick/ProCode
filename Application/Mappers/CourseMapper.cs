using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class CourseMapper
{
    public static CourseDto MapToDto(Course course)
    {
        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            CreatedOn = course.CreatedOn,
            CreatedBy = course.Creator?.Id ?? course.CreatorId,
            CreatorUsername = course.Creator?.UserName ?? string.Empty,
            Lessons = course.Lessons?.Select(l => l.Id).ToList() ?? new List<Guid>(),
            DifficultyLevel = course.DifficultyLevel,
            Rating = course.Rating,
        };
    }

    public static List<CourseDto> MapListToDto(ICollection<Course> courses)
    {
        return courses.Select(MapToDto).ToList();
    }
}