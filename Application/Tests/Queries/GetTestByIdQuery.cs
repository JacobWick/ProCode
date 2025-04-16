using Application.DTOs;
using MediatR;

namespace Application.Tests.Queries;

public class GetTestByIdQuery : IRequest<TestDto>
{
    public Guid Id { get; set; }
}