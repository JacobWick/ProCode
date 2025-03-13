using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PostgresDbContext: DbContext
    {
        public DbSet<Course> Courses { get; set; }

        public PostgresDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
