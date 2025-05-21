using System.Reflection.Metadata.Ecma335;
using Application.Common.Models;
using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.QueriesHandlers
{
    public class SearchCoursesQueryHandler : IRequestHandler<SearchCoursesQuery, PaginatedResult<CourseOverviewDto>?>
    {
        private readonly IRepository<Course> _courseRepository;
        public SearchCoursesQueryHandler(IRepository<Course> courseRepository, IRepository<UserProfile> userProfileRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<PaginatedResult<CourseOverviewDto>?> Handle(SearchCoursesQuery request, CancellationToken cancellationToken)
        {
            var courses = await _courseRepository.GetAsync(c => c.Description.Contains(request.SearchTerm) || c.Title.Contains(request.SearchTerm), cancellationToken);

            if (courses == null)
            {
                return null;
            }

            var coursesDto = courses.OrderBy(c => c.Title).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).Select(c => new CourseOverviewDto()
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                DifficultyLevel = c.DifficultyLevel,
                CreatedBy  = new BriefAuthorUserDto()
                {
                    FirstName = c.User.FirstName,
                    LastName = c.User.LastName,
                    AvatarUri = c.User.Profile.AvatarUrl
                },
                Rating = c.Rating
            }).ToList();

            return new PaginatedResult<CourseOverviewDto>
            {
                Items = coursesDto,
                TotalCount = courses.Count(),
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}
