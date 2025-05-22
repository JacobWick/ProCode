using Application.Tests.Commands;
using FluentValidation;

namespace Application.Validators.Test;

public class CreateTestCommandValidator : AbstractValidator<CreateTestCommand>
{
    public CreateTestCommandValidator()
    {
        RuleFor(x => x.InputData)
            .NotNull().WithMessage("InputData is required.")
            .Must(data => data.Any()).WithMessage("InputData must contain at least one item.")
            .Must(data => data.All(d => !string.IsNullOrWhiteSpace(d))).WithMessage("All InputData items must be non-empty strings.");

        RuleFor(x => x.OutputData)
            .NotNull().WithMessage("OutputData is required.")
            .Must(data => data.Any()).WithMessage("OutputData must contain at least one item.")
            .Must(data => data.All(d => !string.IsNullOrWhiteSpace(d))).WithMessage("All OutputData items must be non-empty strings.");

        RuleFor(x => x.ExerciseId)
            .NotEqual(Guid.Empty).WithMessage("ExerciseId is required.");
    }
}