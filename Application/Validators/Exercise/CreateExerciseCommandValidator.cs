using Application.Exercises.Commands;
using FluentValidation;

namespace Application.Validators.Exercise;

public class CreateExerciseCommandValidator  : AbstractValidator<CreateExerciseCommand>
{
    public CreateExerciseCommandValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MinimumLength(20).WithMessage("Description must be at least 20 characters long")
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters");
        RuleFor(x => x.InitialContent)
            .NotEmpty().WithMessage("Initial content is required")
            .MinimumLength(10).WithMessage("Initial content must be at least 10 characters long")
            .MaximumLength(500).WithMessage("Initial content must not exceed 500 characters");
        RuleFor(x => x.LessonId)
            .NotEqual(Guid.Empty).WithMessage("LessonId is required");

    }
}