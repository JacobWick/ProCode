using Application.Lessons.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Lessons.CommandHandlers;

public class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, bool>
{
    private readonly IRepository<Lesson> _lessonRepository;
    private readonly IRepository<Exercise> _exerciseRepository;

    public CreateLessonCommandHandler(IRepository<Lesson> lessonRepository, IRepository<Exercise> exerciseRepository)
    {
        _lessonRepository = lessonRepository;
        _exerciseRepository = exerciseRepository;
    }

    public async Task<bool> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        var exercises = await _exerciseRepository.GetAsync(e => request.Exercises.Contains(e.Id), cancellationToken);

        var lesson = new Lesson()
        {
            Title = request.Title,
            VideoUri = request.VideoUri,
            TextUri = request.TextUri,
            CreatedAt = DateTime.Now,
            Exercises = exercises.ToList()

        };
        return _lessonRepository.CreateAsync(lesson, cancellationToken).IsCompletedSuccessfully;
    }
}