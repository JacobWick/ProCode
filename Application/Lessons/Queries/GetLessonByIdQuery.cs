using Application.DTOs;
using MediatR;

namespace Application.Lessons.Queries;

public class GetLessonByIdQuery : IRequest<LessonDto>
{
    public Guid Id { get; set; }
}