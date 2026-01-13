using Application.Exercises.Commands;
using Application.Exercises.Queries;
using Asp.Versioning;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    [Route("api/v{version:apiVersion}/exercises")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ExerciseController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [MapToApiVersion(1)]
        [Authorize(Roles = Roles.Admin)]
        [HttpPost()]
        public async Task<IActionResult> Create([FromBody] CreateExerciseCommand command, CancellationToken cancellationToken)
        {
            var created = await _mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [MapToApiVersion(1)]
        [Authorize(Roles = Roles.Admin)]
        [HttpGet()]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var list = await _mediator.Send(new GetAllExercisesQuery(), cancellationToken);
            return Ok(list);
        }

        [MapToApiVersion(1)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetExerciseByIdQuery { Id = id }, cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }

        [MapToApiVersion(1)]
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateExerciseCommand command, CancellationToken cancellationToken)
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
            var deleted = await _mediator.Send(new DeleteExerciseCommand { Id = id }, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpPost("run")]
        public async Task<IActionResult> RunCode([FromBody] RunCodeCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpPost("{id}/attempt")]
        public async Task<IActionResult> AttemptExercise(Guid id, [FromBody] AttemptExerciseCommand command, CancellationToken cancellationToken)
        {
            command.ExerciseId = id;

            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpGet("runtimes")]
        public async Task<IActionResult> GetRuntimes(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetRuntimesQuery(), cancellationToken);
            return Ok(result);
        }
    }
}
