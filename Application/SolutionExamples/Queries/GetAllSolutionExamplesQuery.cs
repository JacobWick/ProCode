using Application.DTOs;
using MediatR;

namespace Application.SolutionExamples.Queries;

public class GetAllSolutionExamplesQuery: IRequest<List<SolutionExampleDto>>
{
    
}