using Application.Auth.Commands;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    [Route("api/v{version:apiVersion}/auth")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [MapToApiVersion(1)]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken cancellationToken)
        {
            var success = await _mediator.Send(command, cancellationToken);
            return success ? Ok() : BadRequest("Registration failed");
        }
        [MapToApiVersion(1)]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var token = await _mediator.Send(command, cancellationToken);
                return Ok(new { Token = token });
            }
            catch
            {
                return Unauthorized();
            }
        }
    }
}
