using Domain.Entities;
using System.Net.Http.Headers;

namespace Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUsersByIdWithProgressAndInterestsAsync(Guid id, CancellationToken cancellationToken);
    }
}
