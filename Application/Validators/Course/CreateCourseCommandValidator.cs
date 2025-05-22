using Application.Courses.Commands;
using FluentValidation;

namespace Application.Validators.Course;

public class CreateCourseCommandValidator : AbstractValidator<CreateCourseCommand>
{
    public CreateCourseCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Course title is required.")
            .MaximumLength(200).WithMessage("Course title must not exceed 200 characters.");

        RuleFor(x => x.CreatedBy)
            .NotEqual(Guid.Empty).WithMessage("Course creator is required.");

        RuleFor(x => x.Lessons)
            .NotNull().WithMessage("Lessons list is required.")
            .Must(l => l.Any()).WithMessage("At least one lesson is required.")
            .Must(l => l.All(id => id != Guid.Empty)).WithMessage("All lesson IDs must be valid (non-empty).");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(100).WithMessage("Description must be at least 100 characters long.")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");

        RuleFor(x => x.DifficultyLevel)
            .IsInEnum().WithMessage("Invalid difficulty level.");
    }
}