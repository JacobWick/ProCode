using Application.Tests.Commands;
using FluentValidation;

namespace Application.Validators.Test;

public class CreateTestCommandValidator : AbstractValidator<CreateTestCommand>
{
    public CreateTestCommandValidator()
    {
        RuleFor(x => x.ExerciseId)
            .NotEqual(Guid.Empty)
            .WithMessage("ExerciseId is required.");

        RuleFor(x => x.InputData)
            .NotNull().WithMessage("InputData is required.")
            .Must(d => d.Count > 0)
            .WithMessage("InputData must contain at least one variable.");

        RuleForEach(x => x.InputData)
            .ChildRules(variable =>
            {
                variable.RuleFor(v => v.Value.Value)
                    .NotEmpty()
                    .WithMessage("Input variable value cannot be empty.");

                variable.RuleFor(v => v.Value.Type)
                    .NotEmpty()
                    .WithMessage("Input variable type cannot be empty.");
            });

        RuleFor(x => x.OutputData)
            .NotNull().WithMessage("OutputData is required.")
            .Must(d => d.Count > 0)
            .WithMessage("OutputData must contain at least one variable.");

        RuleForEach(x => x.OutputData)
            .ChildRules(variable =>
            {
                variable.RuleFor(v => v.Value.Value)
                    .NotEmpty()
                    .WithMessage("Output variable value cannot be empty.");

                variable.RuleFor(v => v.Value.Type)
                    .NotEmpty()
                    .WithMessage("Output variable type cannot be empty.");
            });
    }
}