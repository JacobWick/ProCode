using Application.DTOs;
using Application.Interfaces;
using Application.Tests.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Tests.CommandHandlers;

public class CreateTestCommandHandler : IRequestHandler<CreateTestCommand, TestDto>
{
    private readonly IRepository<Test> _testRepository;

    public CreateTestCommandHandler(IRepository<Test> testRepository)
    {
        _testRepository = testRepository;
    }

    public async Task<TestDto> Handle(CreateTestCommand request, CancellationToken cancellationToken)
    {
        var test = new Test
        {
            Exercise = request.Exercise,
            InputData = request.InputData,
            OutputData = request.OutputData,
        };
        await _testRepository.CreateAsync(test, cancellationToken);
        return new TestDto
        {
            Id = test.Id,
            InputData = test.InputData,
            OutputData = test.OutputData,
            ExerciseId = test.Exercise.Id
        };
    }
}