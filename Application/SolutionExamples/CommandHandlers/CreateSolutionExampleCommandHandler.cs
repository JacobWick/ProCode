using Application.Interfaces;
using Application.SolutionExamples.Commands;
using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.CommandHandlers;

public class CreateSolutionExampleCommandHandler : IRequestHandler<CreateSolutionExampleCommand, SolutionExample>
{
    private readonly IRepository<SolutionExample> _solutionExampleRepository;
    private readonly IRepository<Exercise> _exerciseRepository;

    public CreateSolutionExampleCommandHandler(IRepository<SolutionExample> solutionExampleRepository, IRepository<Exercise> exerciseRepository)
    {
        _solutionExampleRepository = solutionExampleRepository;
        _exerciseRepository = exerciseRepository;
    }

    public async Task<SolutionExample> Handle(CreateSolutionExampleCommand request, CancellationToken cancellationToken)
    {
        var exercise = await _exerciseRepository.GetByIdAsync(request.ExerciseId, cancellationToken: cancellationToken);
        if (exercise == null)
        {
            return null;
        }
        var solutionExample = new SolutionExample
        {
            Exercise = exercise,
            Code = request.Code,
            Explanation = request.Explanation
        };
        await _solutionExampleRepository.CreateAsync(solutionExample, cancellationToken);
        return solutionExample;
    }
}