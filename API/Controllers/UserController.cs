using Application.DTOs;
using Application.Users.Commands;
using Application.Users.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiVersion(1)]
[Route("api/v{version:apiVersion}/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [MapToApiVersion(1)]
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(request, cancellationToken);
        
        if(result.Success)
            return Ok(new {status = 200, message = "User created successfully"});
            
        return BadRequest(new { status = 400, message = result.Error ?? "User creation failed." });
    }
    [MapToApiVersion(1)]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto?>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var user = await _mediator.Send(new GetUserByIdQuery{ Id = id }, cancellationToken);
        return Ok(user);
    }
    [MapToApiVersion(1)]
    [HttpGet()]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var list = await _mediator.Send(new GetAllUsersQuery(), cancellationToken);
        return Ok(list);
    }
    [MapToApiVersion(1)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteUserCommand { Id = id }, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpPatch()]
    public async Task<IActionResult> Update([FromBody] UpdateUserCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
}