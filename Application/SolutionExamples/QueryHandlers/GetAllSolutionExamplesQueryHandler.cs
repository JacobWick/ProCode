using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Application.SolutionExamples.Queries;
using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.QueryHandlers;

public class GetAllSolutionExamplesQueryHandler : IRequestHandler<GetAllSolutionExamplesQuery, List<SolutionExampleDto>>
{
    private readonly IRepository<SolutionExample> _repository;

    public GetAllSolutionExamplesQueryHandler(IRepository<SolutionExample> repository)
    {
        _repository = repository;
    }

    public async Task<List<SolutionExampleDto>> Handle(GetAllSolutionExamplesQuery request, CancellationToken cancellationToken)
    {
        var solutionExamples = await _repository.GetAllAsync(cancellationToken: cancellationToken);
        return SolutionExampleMapper.MapListToDto(solutionExamples);
    }
}