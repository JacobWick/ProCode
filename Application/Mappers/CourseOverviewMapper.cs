using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class CourseOverviewMapper
{
    public static CourseOverviewDto MapToDto(Course course)
    {
        return new CourseOverviewDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            CreatedBy = BriefAuthorUserMapper.MapToDto(course.Creator),
            DifficultyLevel = course.DifficultyLevel,
            Rating = course.Rating,
        };
    }
    public static List<CourseOverviewDto> MapListToDto(ICollection<Course> courses)
    {
        return courses.Select(MapToDto).ToList();
    }
}