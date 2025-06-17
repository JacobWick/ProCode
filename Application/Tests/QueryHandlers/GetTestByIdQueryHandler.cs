using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Application.Tests.Queries;
using Domain.Entities;
using MediatR;

namespace Application.Tests.QueryHandlers;

public class GetTestByIdQueryHandler : IRequestHandler<GetTestByIdQuery, TestDto>
{
    private readonly IRepository<Test> _testRepository;

    public GetTestByIdQueryHandler(IRepository<Test> testRepository)
    {
        _testRepository = testRepository;
    }

    public async Task<TestDto> Handle(GetTestByIdQuery request, CancellationToken cancellationToken)
    {
        var test =  await _testRepository.GetByIdAsync(request.Id, t => new Test
        {
            Id = t.Id,
            Exercise = t.Exercise,
            InputData = t.InputData,
            OutputData = t.OutputData,
        },
        cancellationToken);
        if (test == null)
        {
            return null;
        }

        return TestMapper.MapToDto(test);
    }
}