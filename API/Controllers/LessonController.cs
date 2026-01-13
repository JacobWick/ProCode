using Application.Lessons.Commands;
using Application.Lessons.Queries;
using Asp.Versioning;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/lessons")]
[ApiController]
public class LessonsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LessonsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [MapToApiVersion(1)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLessonByIdQuery { Id = id }, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllLessonsQuery(), cancellationToken);

        return result is not null ? Ok(result) : NotFound();
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create(CreateLessonCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteLessonCommand { Id = id }, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return NoContent();
    }

    [MapToApiVersion(1)]
    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLessonCommand command, CancellationToken cancellationToken)
    {
        command.Id = id;
        var result = await _mediator.Send(command, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return NoContent();
    }

    [MapToApiVersion(1)]
    [Authorize]
    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CompleteLessonCommand { LessonId = id }, cancellationToken);
        return result ? Ok() : NotFound();
    }
}