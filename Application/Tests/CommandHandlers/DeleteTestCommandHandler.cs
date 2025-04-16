using Application.Interfaces;
using Application.Tests.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Tests.CommandHandlers;

public class DeleteTestCommandHandler : IRequestHandler<DeleteTestCommand, bool>
{
    private readonly IRepository<Test> _testRepository;

    public DeleteTestCommandHandler(IRepository<Test> testRepository)
    {
        _testRepository = testRepository;
    }

    public async Task<bool> Handle(DeleteTestCommand request, CancellationToken cancellationToken)
    {
        var test = await _testRepository.GetByIdAsync(request.Id);

        if (test == null)
        {
            return false;
        }
        return _testRepository.DeleteAsync(test, cancellationToken).IsCompletedSuccessfully;
    }
}