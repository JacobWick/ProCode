using Application.DTOs;
using MediatR;


namespace Application.Tests.Commands;

public class CreateTestCommand : IRequest<TestDto>
{
    public VariableSetDto InputData { get; set; }
    public VariableSetDto OutputData { get; set; }
    public Guid ExerciseId { get; set; }
}