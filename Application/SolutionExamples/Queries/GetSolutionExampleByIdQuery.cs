using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.Queries;

public class GetSolutionExampleByIdQuery : IRequest<SolutionExample>
{
    public Guid Id  { get; set; }
}