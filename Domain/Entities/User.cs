using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>, IEntity
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
}