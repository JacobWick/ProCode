using Application.Notifications.Commands;
using Application.Notifications.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[ApiVersion(1)]
[ApiController]
[Route("api/v{version:apiVersion}/notifications")]
public class NotificationController: ControllerBase
{
    private readonly IMediator _mediator;
    public NotificationController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [MapToApiVersion(1)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNotificationCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] SendNotificationCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpPut("read")]
    public async Task<IActionResult> MarkAllAsRead([FromBody] MarkAllNotificationsAsReadCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id, [FromBody] MarkNotificationAsReadCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    [MapToApiVersion(1)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAllByUser(Guid id, [FromQuery] bool isRead)
    {
        var query = new GetUserNotificationsQuery
        {
            UserId = id,
            IsRead = isRead
        };
        var notifications = await _mediator.Send(query);
        return Ok(notifications);
    }
    [MapToApiVersion(1)]
    [HttpGet("{id}/count")]
    public async Task<IActionResult> GetUnreadCount(Guid id)
    {
        var query = new GetUnreadNotificationsCountQuery
        {
            UserId = id
        };
        var count = await _mediator.Send(query);
        return Ok(count);
    }
    

    
}