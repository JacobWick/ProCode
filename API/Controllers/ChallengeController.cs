using Application.Challenges.Commands;
using Application.Challenges.Query;
using Asp.Versioning;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    [ApiController]
    [Route("api/v{version:apiVersion}/challenges")]
    public class ChallengeController : Controller
    {
        private readonly IMediator _mediator;
        public ChallengeController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost]
        public async Task<IActionResult> CreateChallenge([FromBody] CreateChallengeCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return result ? Ok() : BadRequest("Challenge completion failed");
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("{id}/exercise")]
        public async Task<IActionResult> CreateExercise(Guid id, [FromBody] CreateChallengeExerciseCommand command, CancellationToken cancellationToken)
        {
            command.ChallengeId = id;

            var result = await _mediator.Send(command, cancellationToken);
            return result ? Ok() : BadRequest("Exercise creation failed");
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChallengeById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetChallengeByIdQuery() { Id = id }, cancellationToken);
            return Ok(result);
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChallenge([FromBody] UpdateChallengeCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return result ? Ok() : BadRequest("Challenge update failed");
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllChallenges([FromQuery] GetAllChallengesQuery query, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveChallenges(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetActiveChallengesQuery(), cancellationToken);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("{id}/status")]
        public async Task<IActionResult> GetChallengeStatus(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(
                new GetChallengeStatusQuery
                {
                    Id = id
                }, cancellationToken);
            
            return Ok(result);
        }

        [Authorize]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> SetChallengeStatus(Guid id, [FromBody] SetChallengeStatusCommand command, CancellationToken cancellationToken)
        {
            command.Id = id;

            var result = await _mediator.Send(command, cancellationToken);
            return result ? Ok() : BadRequest("Setting challenge status failed");
        }
    }
}
