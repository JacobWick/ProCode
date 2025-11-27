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
    }

    private bool BeValidHttpUri(Uri uri)
    {
        return uri.IsAbsoluteUri && 
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}