using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Interfaces
{
    public interface IApplicationDbContext
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Progress> Progresses { get; set; }
        public DbSet<SolutionExample> SolutionExamples { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<UserProfile> userProfiles { get; set; }

    }
}
