using Application.DTOs;

namespace Application.Interfaces
{
    public interface IPistonApiClient
    {
        Task<PistonExecuteResponse> ExecuteAsync(PistonExecuteRequest request, CancellationToken cancellationToken = default);
        Task<List<PistonRuntimeResponse>> GetSupportedLanguagesAsync(CancellationToken cancellationToken = default);
    }
}
