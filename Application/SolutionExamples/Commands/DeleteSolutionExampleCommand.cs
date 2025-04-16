using MediatR;

namespace Application.SolutionExamples.Commands;

public class DeleteSolutionExampleCommand : IRequest<bool>
{
    public Guid Id {get; set;}
}