namespace Domain.Exceptions;

public class ForbiddenException : DomainException
{
    public ForbiddenException(string? message = null) : base(message ?? "You are not authorized to perform this action") {}
}