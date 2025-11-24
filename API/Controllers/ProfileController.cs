using Application.UserProfiles.Commands;
using Application.UserProfiles.Queries;
using Application.Users.Commands;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetPublicProfileByIdQuery { Id = id }, cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpGet("edit-privacy")]
        public async Task<IActionResult> GetEditPrivacy(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new EditPrivacyQuery(), cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpPatch("edit-privacy")]
        public async Task<IActionResult> PatchEditPrivacy([FromBody] EditPrivacyCommand editPrivacyCommmand, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new EditPrivacyCommand(), cancellationToken);
            return result ? Ok(result) : NotFound();
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetEditProfile(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetMyProfileQuery(), cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }

        [MapToApiVersion(1)]
        [Authorize]
        [HttpPatch("me")]
        public async Task<IActionResult> EditProfile([FromBody] EditProfileCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return result ? Ok(result) : NotFound();
        }

        [MapToApiVersion(1)]
        [HttpPut("interests")]
        public async Task<IActionResult> UpdateInterests([FromBody] UpdateInterestsCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return result ? Ok(result) : NotFound();
        }

        [HttpGet("intestest")]
        public async Task<IActionResult> GetInterests(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetInterestsQuery(), cancellationToken);
            return result is not null ? Ok(result) : NotFound();
        }
    }
}
