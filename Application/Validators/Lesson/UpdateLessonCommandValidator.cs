using Application.Lessons.Commands;
using FluentValidation;

namespace Application.Validators.Lesson;

public class UpdateLessonCommandValidator : AbstractValidator<UpdateLessonCommand>
{
    public UpdateLessonCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEqual(Guid.Empty).WithMessage("Lesson Id is required.");

        RuleFor(x => x.Title)
            .MinimumLength(5).WithMessage("Lesson title must be at least 5 characters long")
            .MaximumLength(200).WithMessage("Lesson title must not exceed 200 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Title));

        RuleFor(x => x.Exercises)
            .Must(list => list == null || list.All(id => id != Guid.Empty))
            .WithMessage("All exercise IDs must be valid (non-empty).");

        RuleFor(x => x.VideoUri)
            .Must(url => string.IsNullOrWhiteSpace(url) || BeValidHttpUrl(url))
            .WithMessage("Video URI must be a valid http or https link.");

        RuleFor(x => x.TextUri)
            .Must(url => string.IsNullOrWhiteSpace(url) || BeValidHttpUrl(url))
            .WithMessage("Text URI must be a valid http or https link.");
    }

    private bool BeValidHttpUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}