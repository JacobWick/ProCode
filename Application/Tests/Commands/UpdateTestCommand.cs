using MediatR;

namespace Application.Tests.Commands;

public class UpdateTestCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public List<string> InputData { get; set; }
    public List<string> OutputData { get; set; }
}