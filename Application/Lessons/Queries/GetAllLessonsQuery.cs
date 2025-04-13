using Application.DTOs;
using MediatR;

namespace Application.Lessons.Queries;

public class GetAllLessonsQuery : IRequest<List<LessonDto>>
{
    
}