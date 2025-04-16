using MediatR;

namespace Application.Tests.Commands;

public class DeleteTestCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}