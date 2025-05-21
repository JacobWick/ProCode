using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>, IEntity  
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public Uri? AvatarUri { get; set; }
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
}