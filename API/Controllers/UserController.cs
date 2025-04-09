using Application.DTOs;
using Application.Users.Commands;
using Application.Users.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [MapToApiVersion(1)]
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand request)
    {
        var result = await _mediator.Send(request);
        
        if(result.Success)
            return Ok(new {status = 200, message = "User register successfull"});
            
        return BadRequest(new { status = 400, message = result.Error ?? "Registration failed." });
    }
    [MapToApiVersion(1)]
    [HttpGet("GetById/{id}")]
    public async Task<ActionResult<UserDto?>> GetById(Guid id)
    {
        var user = await _mediator.Send(new GetUserByIdQuery{ Id = id });
        return Ok(user);
    }

    [MapToApiVersion(1)]
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand { Id = id });
        if (!result)
        {
            return NotFound();
        }
        return Ok();
    }

    [MapToApiVersion(1)]
    [HttpPatch("Update")]
    public async Task<IActionResult> Update([FromBody] UpdateUserCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result)
        {
            return NotFound();
        }
        return Ok();
    }
}