using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Application.Tests.Queries;
using Domain.Entities;
using MediatR;

namespace Application.Tests.QueryHandlers;

public class GetAllTestsQueryHandler : IRequestHandler<GetAllTestsQuery, List<TestDto>>
{
    private readonly IRepository<Test> _testRepository;
    
    public GetAllTestsQueryHandler(IRepository<Test> testRepository)
    {
        _testRepository = testRepository;
    }

    public async Task<List<TestDto>> Handle(GetAllTestsQuery request, CancellationToken cancellationToken)
    {
        var tests = await _testRepository.GetAllAsync(cancellationToken: cancellationToken);
        return TestMapper.MapListToDto(tests);
    }
}