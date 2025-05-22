using Application.Tests.Commands;
using FluentValidation;

namespace Application.Validators.Test;

public class UpdateTestCommandValidator : AbstractValidator<UpdateTestCommand>
{
    public UpdateTestCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEqual(Guid.Empty).WithMessage("Test Id is required.");

        RuleFor(x => x.InputData)
            .NotNull().WithMessage("InputData is required.")
            .Must(data => data.Any()).WithMessage("InputData must contain at least one item.")
            .Must(data => data.All(d => !string.IsNullOrWhiteSpace(d))).WithMessage("All InputData items must be non-empty strings.");

        RuleFor(x => x.OutputData)
            .NotNull().WithMessage("OutputData is required.")
            .Must(data => data.Any()).WithMessage("OutputData must contain at least one item.")
            .Must(data => data.All(d => !string.IsNullOrWhiteSpace(d))).WithMessage("All OutputData items must be non-empty strings.");
    }
}