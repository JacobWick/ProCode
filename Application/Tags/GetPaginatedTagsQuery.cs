using Application.Common.Models;
using Application.DTOs;
using MediatR;

namespace Application.Tags
{
    public sealed class GetPaginatedTagsQuery : IRequest<PaginatedResult<TagDto>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 100;
    }
}
