using Application.Common.Models;
using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using MediatR;

namespace Application.Courses.QueriesHandlers
{
    public class GetPaginatedCoursesQueryHandler : IRequestHandler<GetPaginatedCoursesQuery, PaginatedResult<CourseResponse>>
    {

        private readonly ICourseRepository _courseRepo;

        public GetPaginatedCoursesQueryHandler(ICourseRepository courseRepo)
        {
            _courseRepo = courseRepo;
        }

        public async Task<PaginatedResult<CourseResponse>> Handle(GetPaginatedCoursesQuery request, CancellationToken cancellationToken)
        {
           var courses = await _courseRepo.GetPaginatedCoursesAsync(
                request.Page, 
                request.PageSize, 
                request.Query, 
                request.SortBy, 
                cancellationToken: cancellationToken);

            return courses;
        }
    }
}
