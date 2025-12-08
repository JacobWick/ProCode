using Application.DTOs;
using Application.Interfaces;
using Application.Tests.Commands;
using Domain.Entities;
using MediatR;
using System.Text.Json;

namespace Application.Tests.CommandHandlers;

public class UpdateTestCommandHandler : IRequestHandler<UpdateTestCommand, bool>
{
    private readonly IRepository<Test> _testRepository;

    public UpdateTestCommandHandler(IRepository<Test> testRepository)
    {
        _testRepository = testRepository;
    }

    public async Task<bool> Handle(UpdateTestCommand request, CancellationToken cancellationToken)
    {
        var test = await _testRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);
        if (test is null) 
            return false;

        test.InputData = ToJsonDocument(request.InputData);
        test.OutputData = ToJsonDocument(request.OutputData);

        await _testRepository.UpdateAsync(test, cancellationToken);
        return true;
    }

    private static JsonDocument ToJsonDocument(VariableSetDto data)
    {
        var json = JsonSerializer.Serialize(data);
        return JsonDocument.Parse(json);
    }
}