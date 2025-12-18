using Application.Common.Models;
using Application.Courses.Queries;

namespace Application.Interfaces
{
    public interface ICourseRepository
    {
        Task<PaginatedResult<CourseResponse>> GetPaginatedCoursesAsync(
            int pageNumber,
            int pageSize,
            string? searchTerm = null,
            string? sortBy = null,
            CancellationToken cancellationToken = default);
    }
}
