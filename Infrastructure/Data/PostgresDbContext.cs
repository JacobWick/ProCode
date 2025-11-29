using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PostgresDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid> , IApplicationDbContext
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Progress> Progresses { get; set; }
        public DbSet<SolutionExample> SolutionExamples { get; set; }
        public DbSet<Test> Tests { get; set; }
        public new DbSet<User> Users { get; set; }
        public DbSet<UserProfile> userProfiles { get; set; }
        public DbSet<UserCourse> userCourses { get; set; }
        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) : base(options)
        {
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Creator)
                .WithMany()
                .HasForeignKey(c => c.CreatorId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.Course)
                .WithMany(c => c.Lessons)
                .HasForeignKey(l => l.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Exercise>()
                .HasOne(e => e.Lesson)
                .WithMany(l => l.Exercises)
                .HasForeignKey(e => e.LessonId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Exercise>()
                .HasOne(e => e.Test)
                .WithOne(t => t.Exercise)
                .HasForeignKey<Test>(t => t.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Exercise>()
                .HasOne(e => e.SolutionExample)
                .WithOne(s => s.Exercise)
                .HasForeignKey<SolutionExample>(s => s.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Test>()
                .HasIndex(t => t.ExerciseId)
                .IsUnique();

            modelBuilder.Entity<UserCourse>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.CoursesEnrolledIn)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UserCourse>()
                .HasOne(uc => uc.Course)
                .WithMany(c => c.UsersEnrolled)
                .HasForeignKey(uc => uc.CourseId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.TagsIntrestedIn)
                .WithMany(t => t.InterestedUsers);
        }

    }
    
}
