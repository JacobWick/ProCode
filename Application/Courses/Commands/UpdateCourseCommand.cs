using Domain.Enums;
using MediatR;

namespace Application.Courses.Commands;

public class UpdateCourseCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DifficultyLevel DifficultyLevel { get; set; }
    public List<Guid>? Lessons { get; set; }
}