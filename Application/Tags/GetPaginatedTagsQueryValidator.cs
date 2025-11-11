using FluentValidation;

namespace Application.Tags
{
    public class GetPaginatedTagsQueryValidator : AbstractValidator<GetPaginatedTagsQuery>
    {
        public GetPaginatedTagsQueryValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0).WithMessage("Page must be greater than 0.");

            RuleFor(x => x.PageSize)
                .InclusiveBetween(20, 100).WithMessage("Page size must be between 20 and 100 inlcusively");
        }
    }
}
