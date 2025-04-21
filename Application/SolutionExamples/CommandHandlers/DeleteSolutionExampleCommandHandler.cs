using Application.Interfaces;
using Application.SolutionExamples.Commands;
using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.CommandHandlers;

public class DeleteSolutionExampleCommandHandler : IRequestHandler<DeleteSolutionExampleCommand, bool>
{
    private readonly IRepository<SolutionExample> _solutionExampleRepository;

    public DeleteSolutionExampleCommandHandler(IRepository<SolutionExample> solutionExampleRepository)
    {
        _solutionExampleRepository = solutionExampleRepository;
    }

    public async Task<bool> Handle(DeleteSolutionExampleCommand request, CancellationToken cancellationToken)
    {
        var solutionExample = await _solutionExampleRepository.GetByIdAsync(request.Id, cancellationToken:cancellationToken);

        if (solutionExample == null)
            return false;
        await _solutionExampleRepository.DeleteAsync(solutionExample, cancellationToken);
        return true;
    }
}