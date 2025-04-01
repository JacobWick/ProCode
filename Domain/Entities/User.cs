using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>, IEntity
{
    [Key]
    public Guid Id { get; set; }
    [PersonalData]
    public string UserName { get; set; }
    [PersonalData] 
    public string FirstName { get; set; } = string.Empty;
    [PersonalData]
    public string LastName { get; set; } = string.Empty;
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
}