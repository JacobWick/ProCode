using Application.Exercises.Commands;
using FluentValidation;

namespace Application.Validators.Exercise;

public class UpdateExerciseCommandValidator :  AbstractValidator<UpdateExerciseCommand>
{
    public UpdateExerciseCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required");
        RuleFor(x => x.Description)
            .MinimumLength(10).WithMessage("Description must be at least 10 characters long")
            .MaximumLength(500).WithMessage("Description must be at least 500 characters long")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}