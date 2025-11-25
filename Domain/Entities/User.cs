using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>, IEntity  
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<UserCourse> CoursesEnrolledIn { get; set; } = new List<UserCourse>();
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
    public ICollection<Tag> TagsIntrestedIn { get; set; } = new List<Tag>();

    public UserProfile Profile { get; set; } = null!;
}