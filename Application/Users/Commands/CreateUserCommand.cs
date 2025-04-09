﻿using Application.DTOs;
using MediatR;

namespace Application.Users.Commands;

public class CreateUserCommand : IRequest<CreateUserResult>
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}