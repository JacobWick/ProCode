using Application.Interfaces;
using Application.Lessons.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Lessons.CommandHandlers;

public class UpdateLessonCommandHandler : IRequestHandler<UpdateLessonCommand, bool>
{
    private readonly IRepository<Lesson> _lessonRepository;
    private readonly IRepository<Exercise> _exerciseRepository;

    public UpdateLessonCommandHandler(IRepository<Lesson> lessonRepository, IRepository<Exercise> exerciseRepository)
    {
        _lessonRepository = lessonRepository;
        _exerciseRepository = exerciseRepository;
    }

    public async Task<bool> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
    {
        var lesson = await _lessonRepository.GetByIdAsync(request.Id);
        if (lesson == null)
        {
            return false;
        }

        if (request.Title != "")
        {
            lesson.Title = request.Title;
        }

        if (request.Description != "")
        {
            lesson.Description = request.Description;
        }

        if (request.VideoUri != lesson.VideoUri)
        {
            lesson.VideoUri = request.VideoUri;
        }

        if (request.TextUri != lesson.VideoUri)
        {
            lesson.TextUri = request.TextUri;
        }

        if (request.Exercises.Count > 0)
        {
            foreach (var exerciseId in request.Exercises)
            {
                if (lesson.Exercises.Any(e => e.Id == exerciseId))
                    continue;
                var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);
                if (exercise is not null)
                {
                    lesson.Exercises.Add(exercise);
                }
            }
        }
        await _lessonRepository.UpdateAsync(lesson, cancellationToken);
        return true;
    }
}