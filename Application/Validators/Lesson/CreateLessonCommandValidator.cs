using Application.Lessons.Commands;
using FluentValidation;

namespace Application.Validators.Lesson;

public class CreateLessonCommandValidator : AbstractValidator<CreateLessonCommand>
{
    public CreateLessonCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Lesson title is required.")
            .MaximumLength(200).WithMessage("Lesson title must not exceed 200 characters.");

        RuleFor(x => x.VideoUri)
            .NotNull().WithMessage("Lesson video URI is required.")
            .Must(BeValidHttpUri).WithMessage("Video URI must start with http or https.");

        RuleFor(x => x.TextUri)
            .NotNull().WithMessage("Lesson text URI is required.")
            .Must(BeValidHttpUri).WithMessage("Text URI must start with http or https.");
    }

    private bool BeValidHttpUri(Uri uri)
    {
        return uri.IsAbsoluteUri && 
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}