using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
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
        var exercise = await _exerciseRepository.GetByIdAsync(request.ExerciseId, cancellationToken: cancellationToken);
        if (exercise is null)
            return null!;
        
        var existing = await _testRepository
            .GetAsync(t => t.ExerciseId == request.ExerciseId, cancellationToken: cancellationToken);
        if (existing != null && existing.Any())
        {
            return TestMapper.MapToDto(existing.First());
        }
        var test = new Test
        {
            ExerciseId = exercise.Id,
            InputData = request.InputData ?? new List<string>(),
            OutputData = request.OutputData ?? new List<string>()
        };

        await _testRepository.CreateAsync(test, cancellationToken);
        return TestMapper.MapToDto(test);
    }
}
