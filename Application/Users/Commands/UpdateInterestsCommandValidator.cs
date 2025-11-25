using FluentValidation;

namespace Application.Users.Commands
{
    public class UpdateInterestsCommandValidator : AbstractValidator<UpdateInterestsCommand>
    {
        public UpdateInterestsCommandValidator()
        {
            RuleFor(x => x.Tags)
                .NotNull().WithMessage("Tags list cannot be null")
                .Must(tags => tags.Count > 0).WithMessage("Tags list must contain at least one tag")
                .Must(tags => tags.Distinct().Count() == tags.Count).WithMessage("Tags list contains duplicate entries");
        }
    }
}
