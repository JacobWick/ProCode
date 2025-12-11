using Application.DTOs;
using Application.Exercises.Queries;
using Application.Interfaces;
using MediatR;

namespace Application.Exercises.QueryHandlers
{
    public class GetRuntimesQueryHandler : IRequestHandler<GetRuntimesQuery, List<PistonRuntimeResponse>>
    {
        private readonly IExerciseService _exerciseService;

        public GetRuntimesQueryHandler(IExerciseService exerciseService)
        {
             _exerciseService = exerciseService;
        }

        public async Task<List<PistonRuntimeResponse>> Handle(GetRuntimesQuery request, CancellationToken cancellationToken)
        {
            var runtimes = await _exerciseService.GetSupportedRuntimes(cancellationToken);

            if (runtimes is null)
            {
                throw new Exception("Could not retrieve supported runtimes.");
            }

            return runtimes;
        }
    }
}
