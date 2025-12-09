using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IExerciseService
    {
        Task<bool> AttemptExercise(
            string Code, 
            Exercise exercise, 
            CancellationToken cancellationToken = default);
        Task<PistonExecuteResponse> ExecuteCode(
            string code,
            string language,
            string version,
            CancellationToken cancellationToken = default);

        Task<List<PistonRuntimeResponse>> GetSupportedRuntimes(
            CancellationToken cancellationToken);
    }
}
