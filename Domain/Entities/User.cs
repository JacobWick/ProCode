using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>
{
    [PersonalData]
    public string Username { get; set; }
    [PersonalData]
    public string Name { get; set; }
    [PersonalData]
    public string Surname { get; set; }
    [PersonalData]
    public List<Progress> Progresses { get; set; }
}