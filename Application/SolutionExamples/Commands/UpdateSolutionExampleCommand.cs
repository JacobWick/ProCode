using MediatR;

namespace Application.SolutionExamples.Commands;

public class UpdateSolutionExampleCommand : IRequest<bool>
{
    public Guid Id { get; set;}
    public string Code { get; set; }
    public string Explanation { get; set; }
}