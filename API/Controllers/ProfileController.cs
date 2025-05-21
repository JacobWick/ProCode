using Application.UserProfiles.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    [Route("api/v{version:apiVersion}/profiles")]
    [ApiController]
    public class ProfileController : Controller
    {
        private readonly IMediator _mediator;

        public ProfileController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [MapToApiVersion(1)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByUserId(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetPublicProfileByUserIdQuery { Id = id }, cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }
    }
}
