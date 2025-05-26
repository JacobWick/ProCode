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
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Title));

        RuleFor(x => x.Exercises)
            .Must(list => list == null || list.All(id => id != Guid.Empty))
            .WithMessage("All exercise IDs must be valid (non-empty).");

        RuleFor(x => x.VideoUri)
            .Must(BeValidHttpUri)
            .When(x => x.VideoUri != null)
            .WithMessage("Video URI must be a valid http or https link.");

        RuleFor(x => x.TextUri)
            .Must(BeValidHttpUri)
            .When(x => x.TextUri != null)
            .WithMessage("Text URI must be a valid http or https link.");
    }

    private bool BeValidHttpUri(Uri uri)
    {
        return uri.IsAbsoluteUri &&
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}