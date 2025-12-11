using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Application.Tests.Commands;
using Domain.Entities;
using MediatR;
using System.Text.Json;

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
        var exercise = await _exerciseRepository.GetByIdAsync(request.ExerciseId, cancellationToken: cancellationToken);

        if (exercise is null)
            return null!;
        
        var existing = await _testRepository.GetAsync(
            t => t.ExerciseId == request.ExerciseId, 
            cancellationToken: cancellationToken);

        if (existing != null && existing.Any())
        {
            return TestMapper.MapToDto(existing.First());
        }

        var inputJson = ToJsonDocument(request.InputData);
        var outputJson = ToJsonDocument(request.OutputData);

        var test = new Test
        {
            ExerciseId = exercise.Id,
            InputData = inputJson,
            OutputData = outputJson
        };

        await _testRepository.CreateAsync(test, cancellationToken);
        return TestMapper.MapToDto(test);
    }

    private static JsonDocument ToJsonDocument(VariableSetDto data)
    {
        var json = JsonSerializer.Serialize(data);
        return JsonDocument.Parse(json);
    }
}
