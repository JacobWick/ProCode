using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PostgresDbContext: DbContext
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Progress> Progresses { get; set; }
        public DbSet<SolutionExample> SolutionExamples { get; set; }
        public DbSet<Tests> Tests { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ValidationMethod> ValidationMethods { get; set; }
        
        public PostgresDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
