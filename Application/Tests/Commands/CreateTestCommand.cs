using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Tests.Commands;

public class CreateTestCommand : IRequest<TestDto>
{
    public List<string> InputData { get; set; }
    public List<string> OutputData { get; set; }
    public Exercise Exercise { get; set; }
}