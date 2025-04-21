using Application.Exercises.Commands;
using Application.Exercises.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ExerciseController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [MapToApiVersion(1)]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateExerciseCommand command, CancellationToken cancellationToken)
        {
            var created = await _mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        [MapToApiVersion(1)]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var list = await _mediator.Send(new GetAllExercisesQuery(), cancellationToken);
            return Ok(list);
        }
        [MapToApiVersion(1)]
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetExerciseByIdQuery { Id = id }, cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }
        [MapToApiVersion(1)]
        [HttpPatch("Update")]
        public async Task<IActionResult> Update( [FromBody] UpdateExerciseCommand command, CancellationToken cancellationToken)
        {
            var updated = await _mediator.Send(command, cancellationToken);
            return updated ? NoContent() : NotFound();
        }
        [MapToApiVersion(1)]
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var deleted = await _mediator.Send(new DeleteExerciseCommand { Id = id }, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }
}
