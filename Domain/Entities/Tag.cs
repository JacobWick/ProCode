using Domain.Interfaces;

namespace Domain.Entities
{
    public class Tag : IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}
