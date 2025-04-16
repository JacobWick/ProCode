using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.Commands;

public class CreateSolutionExampleCommand : IRequest<SolutionExample>
{
    public string Code { get; set; }
    public string Explanation { get; set; }
}