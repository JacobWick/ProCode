using Application.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.Courses.Commands;

public class CreateCourseCommand : IRequest<CourseDto>
{
    public Guid CreatedBy { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DifficultyLevel DifficultyLevel { get; set; }
}