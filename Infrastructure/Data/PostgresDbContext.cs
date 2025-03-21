using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PostgresDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid> 
    {
        public DbSet<Course> courses { get; set; }
        public DbSet<Exercise> exercises { get; set; }
        public DbSet<Lesson> lessons { get; set; }
        public DbSet<Notification> notifications { get; set; }
        public DbSet<Progress> progresses { get; set; }
        public DbSet<SolutionExample> solutionExamples { get; set; }
        public DbSet<Tests> tests { get; set; }
        public DbSet<ValidationMethod> validationMethods { get; set; }



        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) : base(options)
        {
        }
    }
}
