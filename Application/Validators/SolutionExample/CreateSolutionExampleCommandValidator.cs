using Application.SolutionExamples.Commands;
using FluentValidation;

namespace Application.Validators.SolutionExample;

public class CreateSolutionExampleCommandValidator : AbstractValidator<CreateSolutionExampleCommand>
{
    public CreateSolutionExampleCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.")
            .MinimumLength(5).WithMessage("Code must be at least 5 characters long.")
            .MaximumLength(10000).WithMessage("Code must not exceed 10,000 characters.");

        RuleFor(x => x.Explanation)
            .NotEmpty().WithMessage("Explanation is required.")
            .MinimumLength(20).WithMessage("Explanation must be at least 20 characters long.")
            .MaximumLength(3000).WithMessage("Explanation must not exceed 3,000 characters.");
    }
}