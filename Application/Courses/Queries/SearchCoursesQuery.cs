using System.ComponentModel.DataAnnotations;
using Application.Common.Models;
using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries
{
    public class SearchCoursesQuery: IRequest<PaginatedResult<CourseOverviewDto>?>
    {
        public string SearchTerm { get; set; } = string.Empty;
        public int Page { get; set; } = 1;
        [Range(1, 100)]
        public int PageSize { get; set; } = 20;

    }
}
