using Domain.Entities;

namespace Application.Interfaces
{
    public interface IChallengeRepository
    {
        Task<List<Challenge>> GetPaginatedChallengesAsync(
            int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<int> GetTotalChallengesCountAsync(CancellationToken cancellationToken);
    }
}
