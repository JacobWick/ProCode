using Application.Courses.Commands;
using Application.Courses.Queries;
using Application.Courses.QueriesHandlers;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/courses")]
[ApiController]
public class CourseController : ControllerBase
{
    private readonly IMediator _mediator;

    public CourseController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [MapToApiVersion(1)]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] CreateCourseCommand command, CancellationToken cancellationToken)
    {
        var created = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new {id = created.Id}, created);
    }
    [MapToApiVersion(1)]
    [HttpGet()]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var list = await _mediator.Send(new GetAllCoursesQuery(), cancellationToken);
        return Ok(list);
    }
    [MapToApiVersion(1)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCourseByIdQuery { Id = id }, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }
    [MapToApiVersion(1)]
    [HttpPatch()]
    public async Task<IActionResult> Update([FromBody] UpdateCourseCommand command, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(command, cancellationToken);
        return updated ?  NoContent() : NotFound();
    }
    [MapToApiVersion(1)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _mediator.Send(new DeleteCourseCommand { Id = id });
        return deleted ? NoContent() : NotFound();
    }

    [MapToApiVersion(1)]
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchCoursesQuery query, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(query, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }

    [MapToApiVersion(1)]
    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetProgress(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCourseProgressQuery { CourseId = id }, cancellationToken);
        return result is not null ? Ok(result) : NotFound();
    }

    [MapToApiVersion(1)]
    [HttpPatch("{id}/tags")]
    public async Task<IActionResult> AssignTagsToCourse(Guid id, [FromBody] AssignTagsToCourseCommand command, CancellationToken cancellationToken)
    {
        command.CourseId = id;

        await _mediator.Send(command, cancellationToken);
        return NoContent();
    }

    [MapToApiVersion(1)]
    [HttpPost("{id}/enroll")]
    public async Task<IActionResult> EnrollInCourse(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new EnrollInCourseCommand { CourseId = id}, cancellationToken);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { Message = $"User successfully enrolled in course {id}." });
    }

    [MapToApiVersion(1)]
    [HttpGet("recommended")]
    public async Task<IActionResult> GetRecommendedCourses(CancellationToken cancellationToken)
    {
        var query = new GetPersonalizedRoadmapsQuery();

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}