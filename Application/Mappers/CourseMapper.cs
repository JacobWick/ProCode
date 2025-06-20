﻿using Application.DTOs;
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
            CreatedBy = course.User.Id,
            Lessons = course.Lessons.Select(l => l.Id).ToList(),
            DifficultyLevel = course.DifficultyLevel,
            Rating = course.Rating,
        };
    }

    public static List<CourseDto> MapListToDto(ICollection<Course> courses)
    {
        return courses.Select(MapToDto).ToList();
    }
}