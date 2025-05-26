using Application.Exercises.Commands;
using FluentValidation;

namespace Application.Validators.Exercise;

public class CreateExerciseCommandValidator  : AbstractValidator<CreateExerciseCommand>
{
    public CreateExerciseCommandValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MinimumLength(200).WithMessage("Description must be at least 200 characters long")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");
        RuleFor(x => x.InitialContent)
            .NotEmpty().WithMessage("Initial content is required")
            .MinimumLength(100).WithMessage("Initial content must be at least 100 characters long")
            .MaximumLength(500).WithMessage("Initial content must not exceed 500 characters");
        RuleFor(x => x.LessonId)
            .NotEqual(Guid.Empty).WithMessage("LessonId is required");

    }
}