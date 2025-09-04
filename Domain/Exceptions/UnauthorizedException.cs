namespace Domain.Exceptions;

public class UnauthorizedException : DomainException
{
    public UnauthorizedException(string? message = null) : base(message ?? "Not authorized") {}
}