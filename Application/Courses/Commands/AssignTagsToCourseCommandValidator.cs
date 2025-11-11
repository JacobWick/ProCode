using FluentValidation;

namespace Application.Courses.Commands
{
    public class AssignTagsToCourseCommandValidator : AbstractValidator<AssignTagsToCourseCommand>
    {
        public AssignTagsToCourseCommandValidator()
        {
            RuleFor(x => x.CourseId)
                .NotEqual(Guid.Empty).WithMessage("CourseId is required");
            RuleFor(x => x.TagIds).Must(x => x != null && x.Any())
                .WithMessage("At least one TagId is required");
        }
    }
}
