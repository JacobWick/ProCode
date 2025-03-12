using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser
{
    public string Nickname { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
}