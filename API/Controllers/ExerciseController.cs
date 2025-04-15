using System.Runtime.CompilerServices;
using Application.Exercises.Commands;
using Application.Exercises.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ExercisesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateExerciseCommand command)
        {
            var created = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _mediator.Send(new GetAllExercisesQuery());
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetExerciseByIdQuery { Id = id });
            return result is not null ? Ok(result) : NotFound();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateExerciseCommand command)
        {
            command.Id = id;
            var updated = await _mediator.Send(command);
            return updated ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _mediator.Send(new DeleteExerciseCommand { Id = id });
            return deleted ? NoContent() : NotFound();
        }
    }
}
