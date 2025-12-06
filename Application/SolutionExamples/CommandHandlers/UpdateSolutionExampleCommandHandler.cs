using Application.Interfaces;
using Application.SolutionExamples.Commands;
using Domain.Entities;
using MediatR;

namespace Application.SolutionExamples.CommandHandlers;

public class UpdateSolutionExampleCommandHandler : IRequestHandler<UpdateSolutionExampleCommand, bool>
{
    private readonly IRepository<SolutionExample> _solutionExampleRepository;

    public UpdateSolutionExampleCommandHandler(IRepository<SolutionExample> solutionExampleRepository)
    {
        _solutionExampleRepository = solutionExampleRepository;
    }

    public async Task<bool> Handle(UpdateSolutionExampleCommand request, CancellationToken cancellationToken)
    {
        var solutionExample = await _solutionExampleRepository.GetByIdAsync(request.Id,  cancellationToken: cancellationToken);
        
        if (solutionExample == null) 
            return false;
        if (solutionExample.Code != request.Code)
        {
            solutionExample.Code = request.Code;
        }

        if (solutionExample.Explanation != request.Explanation)
        {
            solutionExample.Explanation = request.Explanation;
        }
        
        
        await _solutionExampleRepository.UpdateAsync(solutionExample, cancellationToken);
        return true; 
        
    }
}