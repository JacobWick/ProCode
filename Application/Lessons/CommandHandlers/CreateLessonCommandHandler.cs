using Application.DTOs;
using Application.Interfaces;
using Application.Lessons.Commands;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Lessons.CommandHandlers;

public class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, LessonDto>
{
    private readonly IRepository<Lesson> _lessonRepository;
    private readonly IRepository<Exercise> _exerciseRepository;

    public CreateLessonCommandHandler(IRepository<Lesson> lessonRepository, IRepository<Exercise> exerciseRepository)
    {
        _lessonRepository = lessonRepository;
        _exerciseRepository = exerciseRepository;
    }

    public async Task<LessonDto> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        var exercises = await _exerciseRepository.GetAsync(e => request.ExerciseIds.Contains(e.Id), cancellationToken);
        
        var videoUri = ParseUri(request.VideoUri);
        var textUri  = ParseUri(request.TextUri);
        var lesson = new Lesson()
        {
            CourseId = request.CourseId,
            Title = request.Title,
            Description = request.Description,
            VideoUri = videoUri,
            TextUri = textUri,
            CreatedAt = DateTime.Now,
            Exercises = exercises.ToList()
        };

        await _lessonRepository.CreateAsync(lesson, cancellationToken);
        return LessonMapper.MapToDto(lesson);
    }
    Uri? ParseUri(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        if (Uri.TryCreate(raw, UriKind.Absolute, out var uri) &&
            (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
        {
            return uri;
        }
        return null;
    }
}