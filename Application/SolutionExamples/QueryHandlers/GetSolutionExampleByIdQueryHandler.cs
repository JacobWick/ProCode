using Application.Interfaces;
using Application.SolutionExamples.Queries;
using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.QueryHandlers;

public class GetSolutionExampleByIdQueryHandler : IRequestHandler<GetSolutionExampleByIdQuery, SolutionExample>
{
    private readonly IRepository<SolutionExample> _solutionExampleRepository;

    public GetSolutionExampleByIdQueryHandler(IRepository<SolutionExample> solutionExampleRepository)
    {
        _solutionExampleRepository = solutionExampleRepository;
    }

    public async Task<SolutionExample> Handle(GetSolutionExampleByIdQuery request, CancellationToken cancellationToken)
    {
        var solutionExample = await _solutionExampleRepository.GetByIdAsync(request.Id, s => new SolutionExample
        {
            Id = s.Id,
            Code = s.Code,
            Explanation = s.Explanation
        });
        if (solutionExample == null)
        {
            return null;
        }
        return solutionExample;
    }
}