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
        if (request.Code is not null)
            solutionExample.Code = request.Code;
        if (request.Explanation is not null)
            solutionExample.Explanation = request.Explanation;
        return _solutionExampleRepository.UpdateAsync(solutionExample, cancellationToken).IsCompletedSuccessfully;
        
    }
}