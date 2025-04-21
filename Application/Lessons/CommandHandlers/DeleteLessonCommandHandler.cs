using Application.Interfaces;
using Application.Lessons.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Lessons.CommandHandlers;

public class DeleteLessonCommandHandler : IRequestHandler<DeleteLessonCommand, bool>
{
    private readonly IRepository<Lesson> _lessonRepository;

    public DeleteLessonCommandHandler(IRepository<Lesson> lessonRepository)
    {
        _lessonRepository = lessonRepository;
    }

    public async Task<bool> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
    {
        var lesson = await _lessonRepository.GetByIdAsync(request.Id);
        if (lesson== null)
            return false;
        await _lessonRepository.DeleteAsync(lesson, cancellationToken);
        return true;
    }
}