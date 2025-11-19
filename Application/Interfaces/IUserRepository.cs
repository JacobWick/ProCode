using Domain.Entities;

namespace Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUsersByIdWithProgressAndInterests(Guid id);
    }
}
