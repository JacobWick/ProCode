using Application.Tests.Commands;
using Application.Tests.Queries;
using Asp.Versioning;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/tests")]
[ApiController]
public class TestController : ControllerBase
{
    private readonly IMediator _mediator;

    public TestController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] CreateTestCommand command, CancellationToken cancellationToken)
    {
        var created = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [MapToApiVersion(1)]
    //[Authorize(Roles = Roles.Admin)]
    [HttpGet()]
    public async Task<IActionResult> GetAll([FromQuery] GetAllTestsQuery request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(request, cancellationToken);
        return Ok(result);
    }

    [MapToApiVersion(1)]
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetTestByIdQuery { Id = id }, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTestCommand command, CancellationToken cancellationToken)
    {
        command.Id = id;
        var updated = await _mediator.Send(command, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteTestCommand { Id = id }, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}