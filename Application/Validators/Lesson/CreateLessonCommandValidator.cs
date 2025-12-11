using Application.Lessons.Commands;
using FluentValidation;

namespace Application.Validators.Lesson;

public class CreateLessonCommandValidator : AbstractValidator<CreateLessonCommand>
{
    public CreateLessonCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Lesson title is required.")
            .MinimumLength(5).WithMessage("Lesson title must be at least 5 characters long")
            .MaximumLength(200).WithMessage("Lesson title must not exceed 200 characters.");
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Lesson description is required.")
            .MinimumLength(10).WithMessage("Lesson description must be at least 10 characters long")
            .MaximumLength(1000).WithMessage("Lesson description must not exceed 1000 characters.");
        RuleFor(x => x.VideoUri)
            .Must(url => string.IsNullOrWhiteSpace(url) || BeValidHttpUri(url))
            .WithMessage("Video URI must start with http or https.");

        RuleFor(x => x.TextUri)
            .Must(url => string.IsNullOrWhiteSpace(url) || BeValidHttpUri(url))
            .WithMessage("Text URI must start with http or https.");
    }

    private bool BeValidHttpUri(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}