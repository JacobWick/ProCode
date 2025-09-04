namespace Domain.Exceptions;

public class DuplicatedEmailException : DomainException
{
    public DuplicatedEmailException(string email) : base($"The email '{email}' is already taken.")
    {
        Email = email;
    }
    
    public string Email { get; }
}