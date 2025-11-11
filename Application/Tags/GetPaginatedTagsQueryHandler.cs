using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Tags
{
    public class GetPaginatedTagsQueryHandler : IRequestHandler<GetPaginatedTagsQuery, PaginatedResult<TagDto>>
    {
        private readonly IApplicationDbContext _dbContext;

        public GetPaginatedTagsQueryHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PaginatedResult<TagDto>> Handle(GetPaginatedTagsQuery request, CancellationToken cancellationToken)
        {
            var tags = await _dbContext.Tags
                .Select(tag => new TagDto
                {
                    Id = tag.Id,
                    Name = tag.Name
                })
                .AsNoTracking()
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var result = new PaginatedResult<TagDto>
            {
                Items = tags,
                TotalCount = await _dbContext.Tags.CountAsync(cancellationToken),
                Page = request.Page,
                PageSize = request.PageSize
            };

            return result;
        }
    }
}
