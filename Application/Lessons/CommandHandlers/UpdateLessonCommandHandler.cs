using Application.DTOs;
using Application.Lessons.Commands;
using Domain.Entities;
using Domain.Interfaces;
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

        if (request.Title is not null)
        {
            lesson.Title = request.Title;
        }

        if (request.VideoUri is not null)
        {
            lesson.VideoUri = request.VideoUri;
        }

        if (request.TextUri is not null)
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
        return _lessonRepository.UpdateAsync(lesson).IsCompletedSuccessfully;
    }
}