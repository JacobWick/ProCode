using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ChallengeRepository : IChallengeRepository
    {
        private readonly PostgresDbContext _context;
        
        public ChallengeRepository(PostgresDbContext context) {
            _context = context;
        }

        public async Task<List<Challenge>> GetPaginatedChallengesAsync(
            int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            return await _context.Challenges
                .OrderBy(c => c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(c => c.Exercises)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<int> GetTotalChallengesCountAsync(CancellationToken cancellationToken)
        {
            return await _context.Challenges.CountAsync(cancellationToken);
        }
    }
}
