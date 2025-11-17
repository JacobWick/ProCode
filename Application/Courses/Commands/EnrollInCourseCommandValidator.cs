using FluentValidation;

namespace Application.Courses.Commands
{
    public class EnrollInCourseCommandValidator : AbstractValidator<EnrollInCourseCommand>
    {
        public EnrollInCourseCommandValidator()
        {
            RuleFor(x => x.CourseId).NotEmpty().WithMessage("Course Id cannot be empty");
        }
    }
}
