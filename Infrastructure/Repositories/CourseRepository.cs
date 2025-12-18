using Application.Common.Models;
using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly PostgresDbContext _context;

        public CourseRepository(PostgresDbContext context)
        {
             _context = context;
        }

        public async Task<PaginatedResult<CourseResponse>> GetPaginatedCoursesAsync(
            int pageNumber,
            int pageSize,
            string? searchTerm = null,
            string? sortBy = null,
            CancellationToken cancellationToken = default)
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize > 20 ? 20 : pageSize;

            IQueryable<Course> query = _context.Courses.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(c =>
                    c.Title.Contains(searchTerm) ||
                    c.Description.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync(cancellationToken);

            query = sortBy switch
            {
                "title" => query.OrderBy(c => c.Title),
                "enrollments" => query.OrderByDescending(c => c.UsersEnrolled.Count),
                _ => query
                    .OrderByDescending(c => c.CreatedOn)
                    .ThenBy(c => c.Id)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(course => new CourseResponse
                {
                    Id = course.Id,
                    Title = course.Title,
                    Description = course.Description,
                    CreatedOn = course.CreatedOn,
                    DifficultyLevel = course.DifficultyLevel,
                    LessonCount = course.Lessons.Count,
                    Tags = course.Tags
                        .Select(t => new TagDto
                        {
                            Id = t.Id,
                            Name = t.Name
                        })
                        .ToList()
                })
                .ToListAsync(cancellationToken);


            return new PaginatedResult<CourseResponse>
                {
                Items = items,
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize
            };
        }

    }
}
