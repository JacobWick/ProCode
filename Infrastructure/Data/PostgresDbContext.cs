using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PostgresDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid> 
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Progress> Progresses { get; set; }
        public DbSet<SolutionExample> SolutionExamples { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<ValidationMethod> ValidationMethods { get; set; }
        
        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) : base(options)
        {
        }
    }
}
