using Application.DTOs;
using MediatR;

namespace Application.Exercises.Commands
{
    public class RunCodeCommand : IRequest<PistonExecuteResponse>
    {
        public string Code { get; set; }
        public string Language { get; set; }
        public string Version { get; set; }
    }
}
