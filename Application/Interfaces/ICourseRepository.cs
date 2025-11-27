using Domain.Entities;

namespace Application.Interfaces
{
    public interface ICourseRepository
    {
        Task<List<Course>> GetPaginatedCoursesWithLessons(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<int> GetTotalCoursesCount(CancellationToken cancellationToken);
    }
}
