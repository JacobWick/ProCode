using Application.Interfaces;
using Application.Tests.Commands;
using Domain.Entities;
using MediatR;

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
        if (request.InputData is not null)
        {
            test.InputData = request.InputData;
        }

        if (request.OutputData is not null)
        {
            test.OutputData = request.OutputData;
        }

        await _testRepository.UpdateAsync(test, cancellationToken);
        return true;
    }
}