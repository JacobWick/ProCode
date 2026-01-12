using Application.Common.Models;
using Application.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.Courses.Queries
{
    public class GetPaginatedCoursesQuery : IRequest<PaginatedResult<CourseResponse>>
    {
        public int PageSize { get; set; } = 20;
        public int Page { get; set; } = 1;
        public string? Search { get; set; } = string.Empty;
        public string? SortBy { get; set; } = string.Empty;
    }

    public class CourseResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public List<TagDto> Tags { get; set; }
        public int LessonCount { get; set; }
    }
}
