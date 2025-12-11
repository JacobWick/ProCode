using Application.DTOs;
using Application.Exercises.Commands;
using Application.Interfaces;
using MediatR;

namespace Application.Exercises.CommandHandlers
{
    public class RunCodeCommandHandler : IRequestHandler<RunCodeCommand, PistonExecuteResponse>
    {
        private readonly IExerciseService _exerciseService;

        public RunCodeCommandHandler(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService; 
        }
        public async Task<PistonExecuteResponse> Handle(RunCodeCommand request, CancellationToken cancellationToken)
        {
            var response = await _exerciseService.ExecuteCode(request.Code, request.Language, request.Version, cancellationToken);

            return response;
        }
    }
}
