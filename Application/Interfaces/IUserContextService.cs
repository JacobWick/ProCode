namespace Application.Interfaces
{
    public interface IUserContextService
    {
        Guid UserId { get; }
        bool IsAuthenticated { get; }
        string UserName { get; }
        string Email { get; }
        List<string> Roles { get; }
    }
}
