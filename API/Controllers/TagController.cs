using Application.Tags;
using Asp.Versioning;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    [ApiController]
    [Route("api/v{version:apiVersion}/tags")]
    public class TagController : Controller
    {
        private readonly IMediator _mediator;

        public TagController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [MapToApiVersion(1)]
        [Authorize(Roles = Roles.Admin)]
        [HttpGet]
        public async Task<IActionResult> GetAllTags([FromQuery] GetPaginatedTagsQuery query , CancellationToken cancellationToken)
        {
            var tags = await _mediator.Send(query, cancellationToken);
            return Ok(tags);
        }

        [MapToApiVersion(1)]
        [Authorize(Roles = Roles.Admin)]
        [HttpPost]
        public async Task<IActionResult> CreateTag([FromBody]CreateTagCommand command, CancellationToken cancellationToken)
        {
            var createdTag = await _mediator.Send(command, cancellationToken);
            return Ok(createdTag);
        }
    }
}
