using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly PostgresDbContext _context;

        public UserRepository(PostgresDbContext context)
        {
            _context = context;
        }


        public async Task<User?> GetUsersByIdWithProgressAndInterests(Guid id)
        {
            return await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new User
                {
                    Id = u.Id,

                    TagsIntrestedIn = u.TagsIntrestedIn
                        .Select(t => new Tag { Name = t.Name })
                        .ToList(),

                    Progresses = u.Progresses.Select(p => new Progress
                    {
                        Lesson = new Lesson
                        {
                            Course = new Course
                            {
                                DifficultyLevel = p.Lesson.Course.DifficultyLevel
                            }
                        }
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
