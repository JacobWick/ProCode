using Application.DTOs;
using MediatR;
using System.Text.Json;

namespace Application.Tests.Commands;

public class UpdateTestCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public VariableSetDto InputData { get; set; }
    public VariableSetDto OutputData { get; set; }
}