using Application.Lessons.Commands;
using Application.Lessons.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class LessonController : ControllerBase
{
    private readonly IMediator _mediator;

    public LessonController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [MapToApiVersion(1)]
    [HttpPost("Create")]
    public async Task<IActionResult> Create(CreateLessonCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteLessonCommand { Id = id }, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpPatch("Update")]
    public async Task<IActionResult> Update(UpdateLessonCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [MapToApiVersion(1)]
    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLessonByIdQuery { Id = id }, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }
}