﻿using Application.UserProfiles.Commands;
using Application.UserProfiles.Queries;
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
        public async Task<IActionResult> PatchEditPrivacy([FromBody]EditPrivacyCommand editPrivacyCommmand, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new EditPrivacyCommand(), cancellationToken);
            return result ? Ok(result) : NotFound();
        }
    }
}
