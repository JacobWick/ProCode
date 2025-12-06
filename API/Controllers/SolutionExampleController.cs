using Application.SolutionExamples.Commands;
using Application.SolutionExamples.Queries;
using Application.Tests.Queries;
using Asp.Versioning;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/solutionexamples")]
[ApiController]
public class SolutionExampleController : ControllerBase
{
    private readonly IMediator _mediator;

    public SolutionExampleController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [MapToApiVersion(1)]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] CreateSolutionExampleCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [MapToApiVersion(1)]
    [HttpGet()]
    public async Task<IActionResult> GetAll([FromQuery] GetAllTestsQuery request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(request, cancellationToken);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpGet("{id}")]
    public async Task<ActionResult<SolutionExample>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetSolutionExampleByIdQuery{ Id = id }, cancellationToken);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteSolutionExampleCommand { Id = id }, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSolutionExampleCommand command, CancellationToken cancellationToken)
    {
        command.Id = id;
        var result = await _mediator.Send(command, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
}