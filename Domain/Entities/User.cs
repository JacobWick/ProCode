﻿using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User: IdentityUser<Guid>
{
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
}