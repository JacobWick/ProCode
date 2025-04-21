using Application.DTOs;
using Application.Interfaces;
using Application.Tests.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Tests.CommandHandlers;

public class CreateTestCommandHandler : IRequestHandler<CreateTestCommand, TestDto>
{
    private readonly IRepository<Test> _testRepository;
    private readonly IRepository<Exercise> _exerciseRepository;

    public CreateTestCommandHandler(IRepository<Test> testRepository, IRepository<Exercise> exerciseRepository)
    {
        _testRepository = testRepository;
        _exerciseRepository = exerciseRepository;
    }

    public async Task<TestDto> Handle(CreateTestCommand request, CancellationToken cancellationToken)
    {
        var exercise = _exerciseRepository.GetByIdAsync(request.ExerciseId).Result;
        var test = new Test
        {
            Exercise = exercise,
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