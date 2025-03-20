using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PostgresDbContext: DbContext
    {
        public DbSet<Course> courses { get; set; }
        public DbSet<Exercise> exercises { get; set; }
        public DbSet<Lesson> lessons { get; set; }
        public DbSet<Notification> notifications { get; set; }
        public DbSet<Progress> progresses { get; set; }
        public DbSet<SolutionExample> solutionExamples { get; set; }
        public DbSet<Tests> tests { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<ValidationMethod> validationMethods { get; set; }



        public PostgresDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
