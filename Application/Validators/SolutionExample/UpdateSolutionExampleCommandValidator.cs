using Application.SolutionExamples.Commands;
using FluentValidation;

namespace Application.Validators.SolutionExample;

public class UpdateSolutionExampleCommandValidator : AbstractValidator<UpdateSolutionExampleCommand>
{
    public UpdateSolutionExampleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEqual(Guid.Empty).WithMessage("Id is required.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.")
            .MinimumLength(10).WithMessage("Code must be at least 5 characters long.")
            .MaximumLength(1000).WithMessage("Code must not exceed 1000 characters.");

        RuleFor(x => x.Explanation)
            .NotEmpty().WithMessage("Explanation is required.")
            .MinimumLength(10).WithMessage("Explanation must be at least 10 characters long.")
            .MaximumLength(1000).WithMessage("Explanation must not exceed 1000 characters.");
    }
}