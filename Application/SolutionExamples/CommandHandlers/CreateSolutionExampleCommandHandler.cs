using Application.Interfaces;
using Application.SolutionExamples.Commands;
using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.CommandHandlers;

public class CreateSolutionExampleCommandHandler : IRequestHandler<CreateSolutionExampleCommand, SolutionExample>
{
    private readonly IRepository<SolutionExample> _solutionExampleRepository;

    public CreateSolutionExampleCommandHandler(IRepository<SolutionExample> solutionExampleRepository)
    {
        _solutionExampleRepository = solutionExampleRepository;
    }

    public async Task<SolutionExample> Handle(CreateSolutionExampleCommand request, CancellationToken cancellationToken)
    {
        var solutionExample = new SolutionExample
        {
            Code = request.Code,
            Explanation = request.Explanation
        };
        await _solutionExampleRepository.CreateAsync(solutionExample, cancellationToken);
        return solutionExample;
    }
}