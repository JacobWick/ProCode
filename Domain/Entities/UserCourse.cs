using Domain.Interfaces;

namespace Domain.Entities
{
    public class UserCourse : IEntity
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public Guid CourseId { get; set; }
        public Course Course { get; set; } = null!;


        public DateTime EnrolledOn { get; set; } = DateTime.UtcNow;
    }
}
