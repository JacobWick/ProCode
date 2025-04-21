using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Users.Queries;

public class GetUserByIdQuery : IRequest<User>
{
    public Guid Id { get; set; }
}