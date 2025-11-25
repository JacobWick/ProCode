using Application.Courses.Commands;
using FluentValidation;

namespace Application.Validators.Course;

public class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
{
    public UpdateCourseCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Course Id is required");
        RuleFor(x => x.Title)
            .MinimumLength(5).WithMessage("Course Title must be at least 5 characters long")
            .MaximumLength(100).WithMessage("Course Title must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));
        RuleFor(x => x.Description)
            .MinimumLength(10).WithMessage("Course Description must be at least 10 characters long")
            .MaximumLength(500).WithMessage("Course Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}